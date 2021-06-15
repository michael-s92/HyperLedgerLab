/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package org.hyperledger.fabric.samples.fabcar;

import com.owlike.genson.annotation.JsonProperty;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.joda.time.DateTime;

import java.util.Objects;

@DataType()
public final class SeedTestFacility {

    @Property
    private final String id;

    @Property()
    private final String privateKey;

    @Property()
    private final String publicKey;

    public String getId() {
        return id;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public SeedTestFacility(@JsonProperty("id") final String id, @JsonProperty("privateKey") final String privateKey,
                            @JsonProperty("publicKey") final String publicKey) {
        this.id = id;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        SeedTestFacility other = (SeedTestFacility) obj;

        return Objects.deepEquals(new Object[] {getId(), getPrivateKey(), getPublicKey()},
                new Object[] {other.getId(), other.getPrivateKey(), other.getPublicKey()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getPrivateKey(), getPublicKey());
    }
}
