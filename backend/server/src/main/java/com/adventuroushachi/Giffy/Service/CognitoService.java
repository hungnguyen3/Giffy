package com.adventuroushachi.Giffy.Service;

import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;

public interface CognitoService {
    CognitoIdentityProviderClient getClient();
}
