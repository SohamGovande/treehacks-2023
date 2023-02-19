import os
import cv2
import numpy as np
import random
import multiprocessing

    # Convert the input image to grayscale
def process_image(image_file, image_output_dir, bbox_output_dir):
    # Load the input image
    input_image = cv2.imread(image_file)

    # Convert the input image to grayscale
    gray_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

    # Apply a threshold to the grayscale image to segment the ship from the background
    _, binary_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    # Find the contours in the binary image
    contours, _ = cv2.findContours(binary_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Find the largest contour, which should correspond to the ship
    largest_contour = max(contours, key=cv2.contourArea)

    # Create a mask for the largest contour
    mask = np.zeros_like(gray_image)
    cv2.drawContours(mask, [largest_contour], 0, (255, 255, 255), -1)

    # Apply the mask to the input image
    boat_cropped = cv2.bitwise_and(input_image, input_image, mask=mask)

    # Read in the ocean image
    # Get a list of all the ocean image files in the water directory
    ocean_dir = '/Users/sayakmaity/Desktop/fulldataset.nosync/water'
    ocean_files = [os.path.join(ocean_dir, f) for f in os.listdir(ocean_dir) if os.path.isfile(os.path.join(ocean_dir, f)) and f.endswith('.png')]

    # Choose a random ocean image
    ocean_file = random.choice(ocean_files)

    # Read in the ocean image
    ocean_image = cv2.imread(ocean_file)
    ocean_image = cv2.resize(ocean_image, None, fx=0.2, fy=0.2, interpolation=cv2.INTER_AREA) 
    ocean_image = cv2.resize(ocean_image, None, fx=10, fy=10, interpolation=cv2.INTER_AREA)
    ocean_image = cv2.GaussianBlur(ocean_image, (5,5), 0)

    # Generate a random coordinate to paste the boat onto the ocean image
# Generate a random coordinate to paste the boat onto the ocean image
    # x_mean = ocean_image.shape[1] / 2
    # x_stddev = ocean_image.shape[1] / 4
    # x_offset = int(np.clip(np.random.normal(x_mean, x_stddev), 0, ocean_image.shape[1] - boat_cropped.shape[1]))

    # y_mean = ocean_image.shape[0] / 2
    # y_stddev = ocean_image.shape[0] / 4
    # y_offset = int(np.clip(np.random.normal(y_mean, y_stddev), 0, ocean_image.shape[0] - boat_cropped.shape[0]))
    x_offset = random.randint(0, ocean_image.shape[1] - boat_cropped.shape[1])
    y_offset = random.randint(0, ocean_image.shape[0] - boat_cropped.shape[0])
    ocean_with_boat = ocean_image.copy()


    # Paste the boat onto the ocean image    
    
    for x in range(boat_cropped.shape[1]):
        for y in range(boat_cropped.shape[0]):
            if boat_cropped[y,x].any():
                ocean_with_boat[y_offset+y, x_offset+x] = boat_cropped[y,x]

    # cv2.imshow('ocean_with_boat',ocean_with_boat)
    # cv2.waitKey(0)
    # if the area of the mask is above 1000
    if cv2.countNonZero(mask) > 100:
        # Save the output image with the same filename as the input image, but with 'output_' prefix
        output_file = os.path.join(image_output_dir, 'output_' + os.path.basename(image_file))
        cv2.imwrite(output_file, ocean_with_boat)

        # Record the bounding box of the boat in the output image
        boat_bbox = (x_offset, y_offset, x_offset+boat_cropped.shape[1], y_offset+boat_cropped.shape[0])
        bbox_file = os.path.join(bbox_output_dir, 'bbox_' + os.path.splitext(os.path.basename(image_file))[0] + '.txt')
        with open(bbox_file, 'w') as f:
            f.write(' '.join(map(str, boat_bbox)))

if __name__ == '__main__':
    # Get a list of all the image files in the directory
    input_dir = '/Users/sayakmaity/Desktop/fulldataset.nosync/main_data'
    image_files = [os.path.join(input_dir, f) for f in os.listdir(input_dir) if os.path.isfile(os.path.join(input_dir, f)) and f.endswith('.jpg')]
    print(len(image_files))

    # image_files = image_files[:10]
    # Just a test image.
    # image_files = ['/Users/sayakmaity/Desktop/fulldataset.nosync/main_data/boat57_3.jpg']
    # image_files = ['/Users/sayakmaity/Desktop/fulldataset.nosync/main_data/boat0_0.jpg']

    # Set the output directories for the images and bounding box files
    image_output_dir = './output_images_2'
    bbox_output_dir = './output_bboxes_2'

    # Create the output directories if they don't exist
    os.makedirs(image_output_dir, exist_ok=True)
    os.makedirs(bbox_output_dir, exist_ok=True)


    # Process each image file in serial
    # for f in image_files:
    #     process_image(f, image_output_dir, bbox_output_dir)

        
    # # Create a multiprocessing pool with the number of worker processes
    # Using multiprocessing to speed up the process.
    num_workers = multiprocessing.cpu_count()  # Use all available CPU cores
    pool = multiprocessing.Pool(num_workers)

    # Process each image file in parallel using the pool map method
    pool.starmap(process_image, [(f, image_output_dir, bbox_output_dir) for f in image_files])
    # Close the pool to free up resources
    pool.close()
    pool.join()

