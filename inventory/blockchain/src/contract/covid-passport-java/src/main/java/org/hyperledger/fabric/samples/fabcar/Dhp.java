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

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Dhp {

    @Property
    private final String id;

    @Property()
    private final TestResult data;

    @Property()
    private final Signature signature;

    public String getId() {
        return id;
    }

    public TestResult getData() {
        return data;
    }

    public Signature getSignature() {
        return signature;
    }

    public Dhp(@JsonProperty("id") final String id, @JsonProperty("data") final TestResult data,
            @JsonProperty("signature") final Signature signature) {
        this.id = id;
        this.data = data;
        this.signature = signature;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Dhp other = (Dhp) obj;

        return Objects.deepEquals(new Object[] {getId(), getData(), getSignature()},
                new Object[] {other.getId(), other.getData(), other.getSignature()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getData(), getSignature());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode()) + " [id=" + id + ", data="
                + data.toString() + ", signature=" + signature + "]";
    }
}
