import { useReducer} from 'react';
import './App.css';
import DigitButton from './components/DigitButton/DigitButton';
import OperationButton from './components/OperationButton/OperationButton';

export const ACTIONS = {
  ADD_DIGIT : "add-digit",
  CHOOSE_OPERATION : "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT : "delete-digit",
  EVALUATE : "evaluate"
}

const evaluate = ({ currentOperand, previousOperand, operation}) => {
  const previous = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(previous) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "-/":
      computation = previous / current;
      break;
    
    default:
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

const formatOperand = (operand) => {
  if(operand == null) return
  const [integer, decimal] = operand.split(".");
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}


const reducer = (state, {type, payload}) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand : payload.digit,
          overwrite: false,
        }  
      }
      else if(payload.digit === "0" && state.currentOperand === "0") return state
      else if(payload.digit === "." && state.currentOperand.includes(".")) return state;
      
      return {
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`,
      }
      
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      else if(state.currentOperand == null){
        return {
          ...state, 
          operation: payload.operation,
        }
      }
      else if(state.previousOperand == null){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }

    case ACTIONS.CLEAR:
        return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      } 
      else if(state.currentOperand == null){
        return state;
      } 
      else if(state.currentOperand.length === 1){
        return{
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null){
        return state;
      }
      return {
        ...state,
        overwrite : true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
    default: 
      break;
  }
}

function App() {
  
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="App">
      <div className="grid grid-cols-4 gap-3 grid-my p-5  my-5 rounded-md">
        <div className="output flex justify-around p-5 flex-col items-end rounded-lg">
          <div className="previous-operand text-white text-1xl">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand text-2xl text-white font-semibold">{formatOperand(currentOperand)}</div>
        </div>
        <button className="span-two" onClick={ () => dispatch({type : ACTIONS.CLEAR })}>AC</button>
        <button onClick={ () => dispatch({type : ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={ () => dispatch({type : ACTIONS.EVALUATE })}>=</button>
      </div>
    </div>
  );
}

export default App;

