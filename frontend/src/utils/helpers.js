import axios from 'axios';

/**
 * Returns a promise that when resolved, returns whether a url is an img or not
 * @param {string} url
 * @returns bool whether url is an image
 */
export function isImage (url) {
  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
}

export function convertImageToBase64 (image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);

    if (typeof image === 'string') {
      // URL / path
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          if (blob.type.startsWith('image/')) {
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Invalid image.'));
          }
        })
        .catch((error) => reject(error));
    } else if (image instanceof File) {
      // file object
      reader.readAsDataURL(image);
    } else {
      reject(new Error('Invalid image.'));
    }
  });
}

export function getDateTime (day, time) {
  const dayNum = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day);
  const date = new Date(0, 0, 1);
  date.setDate(dayNum + 1);
  date.setHours(new Date(time).getHours());
  date.setMinutes(new Date(time).getMinutes());
  return date;
}

export async function fetchClasses (classIds, token, courseid) {
  const newClasses = [];
  for (const classId of classIds) {
    const newClass = await axios.get('/course/get_class_info', {
      params: {
        token,
        course_id: courseid,
        class_id: classId
      }
    })
    newClass.data.class_id = classId
    newClasses.push(newClass.data);
  }
  return newClasses;
}

// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
export function formatNum (num, digits) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'Q' },
  ];
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(item => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(regex, '$1') + item.symbol : '0';
}
