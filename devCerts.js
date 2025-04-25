import devCerts from "office-addin-dev-certs";

export default {
  getHttpsServerOptions: async () => {
    const options = await devCerts.getHttpsServerOptions();
    return options;
  }
}; 