package io.cachesol.platform.shared.common.exception;

public class NotFoundException extends PlatformException {
    public NotFoundException(String entity, String id) {
        super("NOT_FOUND", "%s not found: id=%s".formatted(entity, id));
    }
}
