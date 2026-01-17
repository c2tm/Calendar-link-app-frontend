import Button from 'react-bootstrap/Button';
import "../styles/Form.css";
const Form = ({label, handleSubmit, elements, buttonMsg="Submit"}) => {
    return <form className={`${label}-form`} onSubmit={handleSubmit}>
       {elements.map((element, i) => {
        const Tag = element.element;
        const shouldCall = !!element.stateFn ? true : false;
        if(!!element.innerText) {
            return <Tag id={`${label}-${element.element}-${i}`} name={`${label}-${element.element}-${i}`} onChange={(e) => { if(shouldCall) element.stateFn(e.target.value) }} {...element.props}>{element.innerText}</Tag>
        } else {
            return <Tag id={`${label}-${element.element}-${i}`} name={`${label}-${element.element}-${i}`} onChange={(e) => { if(shouldCall) element.stateFn(e.target.value) }} {...element.props}/>
        }
       })}
       <Button type='submit'>
        {buttonMsg}
       </Button>
    </form>
}

export default Form;