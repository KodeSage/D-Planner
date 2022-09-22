import React from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const Loader = ({ loading }) => {
    return (
        <>
            {loading && (
                <div className="blspinner">
                    <div className="lspinner">
                        <ScaleLoader
                            color="#9828A7"
                            loading={loading}
                            width={10}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Loader;