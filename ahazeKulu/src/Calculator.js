import React, {useState} from 'react';

const Calculator = ()=> {
    const [currentValue, setCurrentValue] = useState('0');
    const [previousValue, setPreviousValue] = useState (null);
    const [operator, setOperator] = useState(null);
    const [overWrite, setOverWrite] = useState(false);


    //logic to handle number input

    const appendNumber = (number) => {
        if (currentValue === '0' || overWrite){
            setCurrentValue(number);
            setOverWrite(false);
        } else {
            setCurrentValue(currentValue + number);
        }
    };

    //to handle operations
    const chooseOperation = (op) => {
        if (previousValue!=null){
            calculate();
        }
        setOperator(op);
        setPreviousValue(currentValue);
        setOverWrite(true);
    };

    const calculate = () =>{
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        if(isNaN(prev)||isNaN(current)) return;

        let result;
        switch(operator){
            case '+': result = prev + current; break
            case '-': result = prev - current; break
            case '*': result = prev * current; break
            case '/': result = prev / current; break
            default: return;
        }

        setCurrentValue(result.toString());
        setPreviousValue(null);
        setOverWrite(true);
    };

    const clear = ()=>{
        setCurrentValue('0');
        setPreviousValue(null);
        setOperator(null);        
    };

    return(
        <div className='flex flex'

    )
}