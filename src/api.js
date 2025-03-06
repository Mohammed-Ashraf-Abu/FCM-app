export const fetchUser = async () => {
  try {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const addPost = async raw => {
  try {
    const response = await fetch('https://dummyjson.com/posts/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: raw?.notification?.body,
        userId: 1,
      }),
    });
    const data = await response.json();
    console.log(data, 'Post added');
  } catch (error) {
    console.log(error);
  }
};
