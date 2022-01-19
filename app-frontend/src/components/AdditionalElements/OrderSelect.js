import { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import { Redirect } from "react-router-dom";

function OrderSelect(props) {

    const [orderKey, setOrderKey] = useState(props.curOrder);
    const [order, setOrder] = useState(null);
    const [desc, setDesc] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [fullOrderList, setFullOrderList] = useState([]);

    useEffect(() => {

        let orderList = [];
        for(let i = 0; i < props.order_list.length; i++) {
            orderList.push([props.order_list[i][0] + 0, props.order_list[i][1]]);
            orderList.push([props.order_list[i][0] + 1, props.order_list[i][1]]);
        }
        setFullOrderList(orderList);
        setOrderKey(props.curOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {

        setOrderKey(props.curOrder);
    }, [props.curOrder]);


    function handleChange(event) {

        let result = event.target.value;
        setOrderKey(result);
        setOrder(result.substring(0, result.length -1));
        setDesc(result.at(-1) === "1");
        setRedirect(true);
    }

    function renderNextOrder(order) {

        let desc = order[0].at(-1) === "0" ? "ascending" : "descending";
        return(
                <option value={order[0]} key={order[0]}>{order[1]} - {desc}</option>
        );
    }

    function renderOrdersInTag() {

        let orderList = fullOrderList;

        return(
            orderList.map(order =>
                renderNextOrder(order)
            )
        );
    }

    function renderRedirect() {
        if(redirect)
            return <Redirect to={props.path + "?order=" + order + "&desc=" + desc}></Redirect>
    }

    function main() {

        return (
            <Row md="auto align-middle" >
                {renderRedirect()}
                <Form>
                    <Form.Label className="d-flex flex-row px-2 mt-2">
                        <Form.Control className="px-2" as="select" value={orderKey} onChange={handleChange} name="order" ref={props.order_ref}>
                            {renderOrdersInTag()}
                        </Form.Control>
                    </Form.Label>
                </Form>
            </Row>
        );
    }

    return main();
}
export default OrderSelect;