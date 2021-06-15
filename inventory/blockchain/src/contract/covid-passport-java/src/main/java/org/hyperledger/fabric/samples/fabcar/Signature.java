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

import java.math.BigInteger;
import java.util.Objects;

@DataType()
public final class Signature {

    @Property
    private final BigInteger r;

    @Property()
    private final BigInteger s;

    public BigInteger getR() {
        return r;
    }

    public BigInteger getS() {
        return s;
    }

    public Signature(@JsonProperty("r") final BigInteger r, @JsonProperty("s") final BigInteger s) {
        this.r = r;
        this.s = s;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Signature other = (Signature) obj;

        return Objects.deepEquals(new Object[] {getR(), getS()},
                new Object[] {other.getR(), other.getS()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getR(), getS());
    }
}
