package chaincode.example;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hyperledger.fabric.shim.ChaincodeBase;
import org.hyperledger.fabric.shim.ChaincodeStub;

public class SimpleChaincode extends ChaincodeBase {

	private static Log _logger = LogFactory.getLog(SimpleChaincode.class);
	
	@Override
	public Response init(ChaincodeStub stub) {
		return newSuccessResponse();
	}

	@Override
	public Response invoke(ChaincodeStub stub) {
		try {
			_logger.info("Invoke java simple chaincode");
			String func = stub.getFunction();
			List<String> params = stub.getParameters();

            if (func.equals("doNothing")) {
                return doNothing(stub, params);
            };
			return newErrorResponse("Invalid invoke function name. Expecting one of: [\"invoke\", \"delete\", \"query\"]");
		} catch (Throwable e) {
			return newErrorResponse(e);
		}
	}

    // doNothing
	private Response doNothing(ChaincodeStub stub, List<String> args) {
		return newSuccessResponse();
	}
	
	public static void main(String[] args) {

		new SimpleChaincode().start(args);
	}
}
