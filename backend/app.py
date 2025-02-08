import os
import google.generativeai as genai
import json
from PIL import Image
from flask import Flask, send_from_directory, jsonify
import base64
from io import BytesIO
import re
app = Flask(__name__)

# Paths
IMAGE_PATH = "doc.jpg"  # Image to analyze (must be in the current working directory)
JSON_PATH = "response.json"  # JSON file to save the response

def clean_api_response(text):
    """Clean the API response to extract valid JSON."""
    try:
        # Remove markdown code blocks if present
        text = re.sub(r'```json|```', '', text)
        return text.strip()
    except Exception as e:
        print(f"Error cleaning response: {e}")
        return text

def analyze_image(image_path):
    """Analyzes a local image using the Gemini API and returns JSON response."""
    try:
        # Check if the image exists
        if not os.path.exists(image_path):
            print(f"Error: Image file not found at {image_path}")
            return {"error": "Image file not found"}

        # Open and process the image
        try:
            img = Image.open(image_path)
            print("Image opened successfully.")
        except Exception as img_error:
            print(f"Error opening image: {img_error}")
            return {"error": f"Error opening image: {img_error}"}

        # Convert image to base64
        try:
            buffered = BytesIO()
            img.save(buffered, format="JPEG")  # Save image to bytes buffer
            img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")  # Encode to base64
            print("Image converted to base64.")
        except Exception as base64_error:
            print(f"Error converting image to base64: {base64_error}")
            return {"error": f"Error converting image to base64: {base64_error}"}

        # Construct the prompt
        prompt = """Analyze this document image and provide the following details in STRICT JSON FORMAT ONLY I WANT TO KNOW WETHER THIS IS FRAUD OR REAL DOC TELL ME THAT IN THE IS VALID FIELD BELOW STRICTLY DOCUMENYTS THAT TOO LEGAL:
        {
            "status": boolean,
            "message": "description",
            "documentType": "type",
            "ownerName": "name",
            "verificationDetails": {
                "isValid": boolean,
                "verifiedBy": "Gemini Pro Vision",
                "comments": "comments"
            }
        }
        Return ONLY the JSON object without any additional text or formatting."""

        # Call Gemini API
        try:
            genai.configure(api_key="AIzaSyDptjvhpE4lYnD0ln5NbpZ74L8DvT9Kfp8")
            model = genai.GenerativeModel('gemini-1.5-flash')
            print("Calling Gemini API...")
            response = model.generate_content(
                [img_base64, prompt],
                generation_config={"temperature": 0.1}  # Ensure deterministic output
            )
            print("API call successful.")
        except Exception as api_error:
            print(f"Error calling Gemini API: {api_error}")
            return {"error": f"Error calling Gemini API: {api_error}"}

        # Debugging: Print raw response
        print("Raw API Response:", response.text)

        # Clean and parse response
        try:
            cleaned_response = clean_api_response(response.text)
            json_response = json.loads(cleaned_response)
            print("API response parsed successfully.")
        except Exception as json_error:
            print(f"Error parsing API response: {json_error}")
            return {"error": f"Error parsing API response: {json_error}"}

        # Save the JSON response to a file
        try:
            with open(JSON_PATH, "w") as f:
                json.dump(json_response, f, indent=4)
            print(f"JSON response saved to {JSON_PATH}.")
        except Exception as file_error:
            print(f"Error saving JSON file: {file_error}")
            return {"error": f"Error saving JSON file: {file_error}"}

        return json_response

    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": str(e)}

@app.route('/responses', methods=['GET'])
def serve_json():
    """Serves the JSON file from the current working directory."""
    try:
        # Ensure the JSON file exists
        if not os.path.exists(JSON_PATH):
            return jsonify({"error": "JSON file not found. Analyze an image first."}), 404

        # Serve the JSON file
        return send_from_directory(os.getcwd(), JSON_PATH, mimetype='application/json')
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Analyze the image and save the JSON response
    if os.path.exists(IMAGE_PATH):
        print(f"Analyzing image: {IMAGE_PATH}")
        result = analyze_image(IMAGE_PATH)
        if "error" in result:
            print(f"Error analyzing image: {result['error']}")
        else:
            print(f"Analysis complete. JSON saved to {JSON_PATH}")
    else:
        print(f"Image {IMAGE_PATH} not found in the current working directory.")

    # Start the Flask app
    print("Starting Flask server...")
    app.run(debug=True, port=5002)