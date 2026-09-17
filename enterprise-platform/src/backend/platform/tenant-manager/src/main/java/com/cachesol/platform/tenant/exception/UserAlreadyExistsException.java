package com.cachesol.platform.tenant.exception;

import com.cachesol.platform.shared.common.exception.PlatformException;

public class UserAlreadyExistsException extends PlatformException {
    public UserAlreadyExistsException(String username) {
        super("USER_ALREADY_EXISTS", "User đã tồn tại: " + username);
    }
}
