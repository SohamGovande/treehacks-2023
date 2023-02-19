from PIL import Image
import os
import multiprocessing

# Define the input and output directories
input_dir = 'negative'
output_dir = 'negative2'

# Define the function to perform the data augmentation on a single image
def augment_image(filename):
    if filename.endswith('.png'):
        # Open the input image
        image = Image.open(os.path.join(input_dir, filename))

        # Perform all combinations of flips and rotations
        for angle in [0, 90, 180, 270]:
            for flip in [True, False]:
                # Rotate and flip the image
                transformed_image = image.rotate(angle)
                if flip:
                    transformed_image = transformed_image.transpose(method=Image.FLIP_LEFT_RIGHT)

                # Save the transformed image as a JPEG
                new_filename = os.path.splitext(filename)[0] + '_rot{}_flip{}.jpg'.format(angle, flip)
                transformed_image.save(os.path.join(output_dir, new_filename))

if __name__ == '__main__':
    # Create a pool of worker processes
    num_processes = multiprocessing.cpu_count()
    pool = multiprocessing.Pool(processes=num_processes)

    # Loop through all the files in the input directory and submit each file to the worker pool
    for filename in os.listdir(input_dir):
        pool.apply_async(augment_image, args=(filename,))

    # Wait for all worker processes to complete
    pool.close()
    pool.join()
