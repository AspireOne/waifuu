import { Preferences } from "@capacitor/preferences";

export const globalForIdToken = globalThis as unknown as {
  idToken: string | null | undefined;
};

async function retrieveIdTokenOrNull() {
  try {
    const { value } = await Preferences.get({ key: "idToken" });
    return value;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Retrieves firebase idToken. Only from local storage, does not fetch it from firebase. Multiple calls are cached.
 *
 * idToken can change over the duration of the app, so always call this to get it.
 * */
export async function getIdToken() {
  let idToken = globalForIdToken.idToken;

  // If uninitialized, initialize it.
  if (idToken === undefined) {
    idToken = await retrieveIdTokenOrNull();
    globalForIdToken.idToken = idToken;
  }

  return idToken;
}

export async function setIdToken(idToken: string) {
  globalForIdToken.idToken = idToken;
  await Preferences.set({ key: "idToken", value: idToken });
}
