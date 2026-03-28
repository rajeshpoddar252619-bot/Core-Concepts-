declare module "*/firebase-applet-config.json" {
  const value: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
    firestoreDatabaseId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
  };
  export default value;
}
