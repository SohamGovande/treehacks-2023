import cv2
import os
import multiprocessing

def process_image(input_image_path, output_folder):
    # Load the input image
    # input_image = cv2.imread(input_image_path)

    # input_image_path = "/Users/sayakmaity/Desktop/fulldataset/images/boat1.png"
    input_image = cv2.imread(input_image_path)

    # Convert the image from RGB to HSV
    hsv = cv2.cvtColor(input_image, cv2.COLOR_BGR2HSV)

    # Multiply saturation and value layer
    hsv[:, :, 1] = hsv[:, :, 1] / (hsv[:, :, 2] + 1e-5)

    # Rescale the product layer from 0 to 255
    hsv[:, :, 1] = hsv[:, :, 1] * 255

    # Find the centroid of the ship based on the product layer
    gray_image = hsv[:, :, 1]
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea)
    M = cv2.moments(largest_contour)

    # Check if M["m00"] is zero to avoid divide by zero error
    if M["m00"] != 0:
        centroid_x = int(M["m10"] / M["m00"])
        centroid_y = int(M["m01"] / M["m00"])
    else:
        centroid_x = 0
        centroid_y = 0

    # Define the size of the bounding box
    bounding_box_size = int(min(input_image.shape[:2]))

    # Find the top-left and bottom-right points of the bounding box
    top_left_x = max(0, centroid_x - bounding_box_size // 2)
    top_left_y = max(0, centroid_y - bounding_box_size // 2)
    bottom_right_x = min(input_image.shape[1], centroid_x + bounding_box_size // 2)
    bottom_right_y = min(input_image.shape[0], centroid_y + bounding_box_size // 2)

    # Crop the image
    cropped_image = input_image[top_left_y:bottom_right_y, top_left_x:bottom_right_x]

    # Save the cropped image to the output folder
    output_image_path = os.path.join(output_folder, os.path.basename(input_image_path))
    cv2.imwrite(output_image_path, cropped_image)


def process_image_2(input_image_path, output_folder):

    # Load the input image
    input_image = cv2.imread(input_image_path)
    print(input_image_path)
    # Convert the input image to grayscale
    
    gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

    # Apply a threshold to the grayscale image to segment the ship from the background
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    # Find the contours in the binary image
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the largest contour, which should correspond to the ship
    largest_contour = max(contours, key=cv2.contourArea)

    # Find the centroid of the largest contour
    M = cv2.moments(largest_contour)
    # Check if M["m00"] is zero to avoid divide by zero error
    if M["m00"] != 0:
        centroid_x = int(M["m10"] / M["m00"])
        centroid_y = int(M["m01"] / M["m00"])
    else:
        centroid_x = 0
        centroid_y = 0

    # Define the initial size of the bounding box
    bounding_box_size = 500

    # Adjust the top-left and bottom-right points of the bounding box to ensure it is a square centered on the centroid
    half_box_size = bounding_box_size // 2
    top_left_x = max(0, centroid_x - half_box_size)
    top_left_y = max(0, centroid_y - half_box_size)
    bottom_right_x = min(input_image.shape[1], centroid_x + half_box_size)
    bottom_right_y = min(input_image.shape[0], centroid_y + half_box_size)

    # # Ensure the bounding box is a square
    box_size = min(bottom_right_x - top_left_x, bottom_right_y - top_left_y)
    bottom_right_x = top_left_x + box_size
    bottom_right_y = top_left_y + box_size

    # Calculate the area of the largest contour
    largest_contour_area = cv2.contourArea(largest_contour)
    cropped_image = input_image 
    
    # Reduce the size of the bounding box until the ship takes up at least 15% of the area in the bounding box
    while largest_contour_area < 0.05 * box_size * box_size:
        bounding_box_size -= 3
        half_box_size = bounding_box_size // 2
        top_left_x = max(0, centroid_x - half_box_size)
        top_left_y = max(0, centroid_y - half_box_size)
        bottom_right_x = min(input_image.shape[1], centroid_x + half_box_size)
        bottom_right_y = min(input_image.shape[0], centroid_y + half_box_size)

        # Ensure the bounding box is a square
        box_size = min(bottom_right_x - top_left_x, bottom_right_y - top_left_y)
        bottom_right_x = top_left_x + box_size
        bottom_right_y = top_left_y + box_size

        # Crop the image
        cropped_image = input_image[top_left_y:bottom_right_y, top_left_x:bottom_right_x]

        gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)


        # Apply a threshold to the cropped image to segment the ship from the background
        _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

        # Find the contours in the cropped image
    
        contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Find the largest contour in the cropped image
        if len(contours) > 0:
            largest_contour = max(contours, key=cv2.contourArea)
            largest_contour_area = cv2.contourArea(largest_contour)
        else:
            largest_contour = None
            largest_contour_area = 0
    output_image_path = os.path.join(output_folder, os.path.basename(input_image_path))
    cv2.imwrite(output_image_path, cropped_image)



def process_image_3(input_image_path, output_folder):
    # Load the input image
    input_image = cv2.imread(input_image_path)
    print(input_image_path)

    # Convert the input image to grayscale
    gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
    # gray_image = cv2.equalizeHist(gray_image)

    # Apply a threshold to the grayscale image to segment the ship from the background
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    # Find the contours in the binary image
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the largest contour, which should correspond to the ship
    largest_contour = max(contours, key=cv2.contourArea)

    # Find the centroid of the largest contour
    M = cv2.moments(largest_contour)
    # Check if M["m00"] is zero to avoid divide by zero error
    if M["m00"] != 0:
        centroid_x = int(M["m10"] / M["m00"])
        centroid_y = int(M["m01"] / M["m00"])
    else:
        centroid_x = 0
        centroid_y = 0

    # Define the initial size of the bounding box
    bounding_box_size = 500

    # Adjust the top-left and bottom-right points of the bounding box to ensure it is a square centered on the centroid
    half_box_size = bounding_box_size // 2
    top_left_x = max(0, centroid_x - half_box_size)
    top_left_y = max(0, centroid_y - half_box_size)
    bottom_right_x = min(input_image.shape[1], centroid_x + half_box_size)
    bottom_right_y = min(input_image.shape[0], centroid_y + half_box_size)

    # Ensure the bounding box is a square
    box_size = min(bottom_right_x - top_left_x, bottom_right_y - top_left_y)
    bottom_right_x = top_left_x + box_size
    bottom_right_y = top_left_y + box_size

    # Calculate the area of the largest contour
    largest_contour_area = cv2.contourArea(largest_contour)
    cropped_image = input_image 

    while largest_contour_area < 0.05 * box_size * box_size:
        bounding_box_size -= 3
        half_box_size = bounding_box_size // 2
        top_left_x = max(0, centroid_x - half_box_size)
        top_left_y = max(0, centroid_y - half_box_size)
        bottom_right_x = min(input_image.shape[1], centroid_x + half_box_size)
        bottom_right_y = min(input_image.shape[0], centroid_y + half_box_size)
        max_crop_size = min(input_image.shape[0], input_image.shape[1])

        # Ensure the bounding box is a square
        box_size = min(bottom_right_x - top_left_x, bottom_right_y - top_left_y, max_crop_size)
        bottom_right_x = top_left_x + box_size
        bottom_right_y = top_left_y + box_size

    # Crop the image
        cropped_image = input_image[top_left_y:bottom_right_y, top_left_x:bottom_right_x]

        gray_image = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

        # Apply a threshold to the cropped image to segment the ship from the background
        _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

        # Find the contours in the cropped image
        contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # Find the largest contour in the cropped image
        if len(contours) > 0:
            largest_contour = max(contours, key=cv2.contourArea)
            largest_contour_area = cv2.contourArea(largest_contour)
        else:
            largest_contour = None
            largest_contour_area = 0

    cropped_image = input_image[top_left_y:bottom_right_y, top_left_x:bottom_right_x]
    output_image_path = os.path.join(output_folder, os.path.basename(input_image_path))
    resized_image = cv2.resize(cropped_image, (512, 512))

    output_image_base = os.path.splitext(os.path.basename(input_image_path))[0]
    for i in range(8):
        if i > 0:
            # Rotate the image by 90 degrees
            resized_image = cv2.rotate(resized_image, cv2.ROTATE_90_CLOCKWISE)

        if i == 4:
            # Flip the image horizontally
            resized_image = cv2.flip(resized_image, 1)

        # Save the image to disk
        output_image_path = os.path.join(output_folder, f"{output_image_base}_{i}.jpg")
        cv2.imwrite(output_image_path, resized_image)

        #

if __name__ == '__main__':
    # Set the input and output directories
    input_folder = "/Users/sayakmaity/Desktop/fulldataset.nosync/masati"
    output_folder = "/Users/sayakmaity/Desktop/fulldataset.nosync/masati2_8_512"

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Get a list of all the image files in the input folder
    image_files = [os.path.join(input_folder, f) for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f)) and f.endswith('.png')]


    # process each image sequentially
    # for image_file in image_files:
    #     process_image_2(image_file, output_folder)

    # Use multiprocessing to process each image in parallel
    with multiprocessing.Pool() as pool:
        pool.starmap(process_image_3, [(image_file, output_folder) for image_file in image_files])
