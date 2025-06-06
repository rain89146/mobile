export interface AppleUserInfo {
    userId: string;
    email: string|null|undefined;
    name: {
        familyName: string|null|undefined;
        givenName: string|null|undefined;
    };
    identityToken: string|null|undefined;
    authorizationCode: string|null|undefined;
    isAuthorized: boolean|null|undefined;
}