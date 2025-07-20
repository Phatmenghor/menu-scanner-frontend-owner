export const getImageType = (file: File): string => {
  return file.type.split("/")[1]; // e.g., "image/jpeg" -> "jpeg"
};

export const compareImageSize = 100 * 1024 * 1024;

export const validTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Function to convert file to base64
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        // We need to remove the prefix from the base64 string
        // e.g., "data:image/jpeg;base64," is removed
        const base64String = fileReader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert to base64"));
      }
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
