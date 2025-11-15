import {React} from "react";
import { useParams } from "react-router-dom";

const Questions = () => {
    const {id} = useParams();
    return (
        <div>
            <h1>Questions {id}</h1>
        </div>
    );
};

export default Questions;
