import re
from flask import Flask, request, jsonify
import boto3
from flask_cors import CORS
import threading
from PIL import Image
import io
import queue

app = Flask(__name__)
CORS(app)  # Allow requests from all origins

# Initialize AWS clients for S3 and Textract
def initialize_aws_client(service_name, aws_access_key_id, aws_secret_access_key, region_name):
    """
    Initialize and return the AWS client for the specified service.
    """
    session = boto3.Session(
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name
    )
    return session.client(service_name)


# Manage S3 operations (upload and delete)
def manage_s3_image(action, s3_client, bucket_name, image_file_name, image_content=None):
    """
    Perform actions on S3: upload or delete an image.
    """
    try:
        if action == 'upload':
            byte_image = image_content.getvalue()
            s3_client.put_object(Bucket=bucket_name, Key=image_file_name, Body=byte_image)
            print(f"Image uploaded to S3 bucket '{bucket_name}' with the file name '{image_file_name}'")
    except Exception as e:
        print(f"Error managing S3 image: {str(e)}")


# Extract text from image using AWS Textract
def extract_text_from_image(textract_client, bucket_name, image_file_name):
    """
    Use AWS Textract to extract text from the image stored in S3.
    """
    try:
        response = textract_client.analyze_document(
            Document={'S3Object': {'Bucket': bucket_name, 'Name': image_file_name}},
            FeatureTypes=["TABLES"]
        )
        return response
    except Exception as e:
        print(f"Error extracting text from image: {str(e)}")
        return {}


# Parse text data returned by Textract
def parse_textract_data(data):
    """
    Extract words from the Textract response and return them as a string.
    """
    words = [block['Text'] for block in data.get('Blocks', []) if block['BlockType'] == 'WORD']
    return ' '.join(words)


def push_image_to_s3(image, image_data, queue):
   #////////////// HERE ///////////////////////////////




   #///////////////////////// END  HERE /////////////////////////

    s3_client = initialize_aws_client('s3', aws_access_key_id, aws_secret_access_key, region_name)
    textract_client = initialize_aws_client('textract', aws_access_key_id, aws_secret_access_key, region_name)

    # Properly initialize BytesIO for saving the image
    byte_image = io.BytesIO()
    image.save(byte_image, format='JPEG')
    byte_image.seek(0)  # Rewind the byte buffer to the beginning

    # Upload the image to S3
    manage_s3_image('upload', s3_client, bucket_name, image_file_name, byte_image)
    textract_data = extract_text_from_image(textract_client, bucket_name, image_file_name)
    parsed_words = parse_textract_data(textract_data)

    patterns = {
        "servings_container": r"(\d+) servings per container|Servings: (\d+)",
        "serving_size": r"Serving size ([^%]+?\))|Serv. size: ([^%]+?\))",  # Modified to capture up to a comma, covering "2 slices (56g)"
        "calories": r"Calories (\d+)",
        "total_fat": r"Total Fat (\d+\.?\d*g \d+%?)",  # Adapted for potential decimals and direct percentage
        "saturated_fat": r"Saturated Fat (\d+\.?\d*g \d+%?)",  # Similarly adapted
        "trans_fat": r"Trans Fat (\d+\.?\d*g)",  # Simplified to just capture the gram amount
        "cholesterol": r"Cholesterol (\d+mg \d+%?)",  # Ensured to capture 'mg' and percentage
        "sodium": r"Sodium (\d+mg \d+%?)",
        "total_carbohydrate": r"Total (?:Carbohydrate|Carb\.?) (\d+g \d+%)|Total (?:Carbohydrate|Carb\.?) (\d+g)",  # Kept as-is
        "dietary_fiber": r"Dietary Fiber (\d+g \d+%?)|Fiber (\d+g \d+%?)",  # Kept as-is
        "total_sugars": r"Sugars (\d+g)",  # Kept as-is
        "protein": r"Protein (\d+g)",
    }

    data = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, parsed_words)
        if match:
            data[key] = next((m for m in match.groups() if m), None)
        else:
            data[key] = None
    
    # Put the result data in the queue to send back to the main thread
    queue.put(data)


@app.route('/label', methods=['POST'])
def label():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    try:
        # Read the image file into memory as bytes
        image_data = image_file.read()

        # Create an in-memory file object using BytesIO
        image = Image.open(io.BytesIO(image_data))

        # Create a queue to receive the processed data from the background thread
        result_queue = queue.Queue()

        # Process the image in a separate thread to avoid blocking the main thread
        threading.Thread(target=push_image_to_s3, args=(image, image_data, result_queue)).start()

        # Wait for the background thread to complete and get the processed data
        result_data = result_queue.get()  # Blocks until data is available

        # Get the image size
        image_size = image.size
        return jsonify({
            "message": "Image received and processed successfully",
            "image_size": {"width": image_size[0], "height": image_size[1]},
            "data": result_data
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=False)
