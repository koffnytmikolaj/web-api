import { Component } from 'react';
import { Container, Col, Row, ProgressBar } from 'react-bootstrap';

export class LoadingBar extends Component {

    render() {

        let loading = this.props.loading;
        let loadingNumber = this.props.loadingNumber !== undefined 
            ? this.props.loadingNumber 
            : true;

        return(
            <Container className="text-center mt-5">
                <Row>
                    <Col md={{ span: 4, offset: 4 }}>
                        <ProgressBar animated now={loading}/>
                        <span style={{display: loadingNumber ? "block" : "none"}}>
                            {loading}%
                        </span>
                    </Col>
                </Row>
            </Container>
        );
    }
}
