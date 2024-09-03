const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = (error) => {
      reject(error);
    };

    document.head.appendChild(script);
  });
};

export default loadGoogleAPI;
