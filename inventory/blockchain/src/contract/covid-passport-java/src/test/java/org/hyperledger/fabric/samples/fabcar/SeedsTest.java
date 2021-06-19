package org.hyperledger.fabric.samples.fabcar;

import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertNotNull;


public final class SeedsTest {
    @Test
    public void testLoadSeeds() throws IOException {
        assertNotNull(Seeds.get());
    }
}