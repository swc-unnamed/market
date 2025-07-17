import { query, command } from '$app/server';

let likes = 0;

export const getLikes = query(async () => {
  return {
    likes: likes
  }
});


export const updateMessage = command(async () => {
  likes += 1;

  return {
    success: true,
  }
})