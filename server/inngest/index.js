import { Inngest } from "inngest";

import User from "../models/User.js";
// Create an Inngest instance
export const inngest = new Inngest({ id: "show-bizz-app" });

/** ---------------------------
 * 1. Sync User Creation from Clerk
 --------------------------- **/
const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url
    };

    await User.create(userData);
  }
);

/** ---------------------------
 * 2. Sync User Deletion
 --------------------------- **/
const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

/** ---------------------------
 * 3. Sync User Updation
 --------------------------- **/
const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },  // Use a different ID here
  { event: 'clerk/user.updated' },   // Corrected event name
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url
    };

    // You used findByIdAndDelete here by mistake. Use findByIdAndUpdate instead.
    await User.findByIdAndUpdate(id, userData);
  }
);

// Export the functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
