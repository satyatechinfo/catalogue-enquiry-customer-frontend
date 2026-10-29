import client from "./api.js";

export async function submitEnquiry(payload) {
  const { data } = await client.post("/enquiries", {
    ...payload,
    source: "WEBSITE",
  });
  if (!data || !data.referenceNumber) {
    throw new Error(
      "The server did not confirm the enquiry. Please try again."
    );
  }
  return data;
}
