import { command } from "$app/server";
import z from "zod";


export const saveAuction = command(z.object({
  id: z.string(),
}), async (data) => {
  console.log('Saving auction:', data);
  return { data }
});

export const closeAuction = command(z.object({
  id: z.string()
}), async (data) => {
  console.log('Closing auction:', data);
  return { data }
})