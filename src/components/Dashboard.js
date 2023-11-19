import React, { useState,useEffect } from 'react';
import InvoiceForm from './InvoiceForm';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { deleteInvoice } from '../store/slices/invoicesSlice';
import { useDispatch } from 'react-redux';

const Dashboard = () => {

    const [openmodel, setOpenmodel] = useState(false);
    const [formdata, setFormdata] = useState();
    const [iseditible,setIseditable]=useState(false);
    const dispatch = useDispatch();
    const invoices = useSelector((state) => state.invoices.invoices)
    useEffect(()=>{
        setFormdata();
    },[])
    const handleRefresh = () => {
        window.location.reload();
      };
    // console.log(invoices);
    return (
        <>
            <button className='btn btn-outline-primary position-relative me-5 mt-3' onClick={() => {setOpenmodel(!openmodel);
                if(openmodel){handleRefresh()}}}>{openmodel ? "Go Back" : "+ INVOICE"}</button>
            {openmodel === false ?
                <div className='d-flex flex-column justify-content-center align-items-start gap-3 w-75 mx-auto'>
                    <h2 className='mt-3'>Your Invoices</h2>
                    <div className='w-100 min-vh-100 mb-5 rounded bg-white d-flex flex-column justify-content-center align-items-center gap-3mx-auto'>
                        {invoices !== undefined && invoices.length > 0 ?
                            (
                                invoices.map((item, ind) => {
                                    return (
                                        <div key={ind} className='w-75'>
                                            <Card >
                                                <Card.Body>
                                                    <Card.Title>{item.billTo}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{item.dateOfIssue}</Card.Subtitle>
                                                    <Card.Text>
                                                        <strong>Amount:</strong> {item.total}
                                                        <br />
                                                    </Card.Text>
                                                    <Button variant="primary" onClick={() => { setFormdata(item); setOpenmodel(true);setIseditable(true) }}>
                                                        Edit
                                                    </Button>
                                                    <Button variant="danger" onClick={() => dispatch(deleteInvoice(item.id))} className='ms-2'>
                                                        Delete
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    )
                                })
                            ) :
                            <div>No Invoices available, Please create one</div>
                        }
                    </div>
                </div>
                : <InvoiceForm formdata={formdata} iseditible={iseditible}/>
            }


        </>
    );


}


export default Dashboard;