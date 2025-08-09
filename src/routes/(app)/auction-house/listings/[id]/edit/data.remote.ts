import { form } from "$app/server";

export const itemForm = form(async (data) => {
  console.log(data);


  return { success: true }
})