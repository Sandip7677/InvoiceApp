import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import { addInvoice } from '../store/slices/invoicesSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDispatch } from 'react-redux';

const InvoiceModal = ({showModal,info, items,closeModal,id}) => {
  const dispatch = useDispatch();
  const GenerateInvoice = () => {
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [612, 792]
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice-001.pdf');
    });
  };

  const AddInvoiceTostore=()=>{
    const obj={
      id: id?id:(new Date() + Math.floor(Math.random() * 999999)).toString(20),
      currency:info.currency,
      dateOfIssue:info.dateOfIssue,
      invoiceNumber:info.invoiceNumber,
      billTo:info.billTo,
      billToEmail:info.billToEmail,
      billToAddress:info.billToAddress,
      billFrom:info.billFrom,
      billFromEmail:info.billFromEmail,
      billFromAddress:info.billFromAddress,
      notes:info.notes,
      total:info.total,
      subTotal:info.subTotal,
      taxRate:info.taxRate,
      taxAmount:info.taxAmount,
      discountRate:info.discountRate,
      discountAmount:info.discountAmount,
      items:[items]
    }

    dispatch(addInvoice(obj));
  }

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <div id="invoiceCapture">
          <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">{info.billFrom}</h4>
              <h6 className="fw-bold text-secondary mb-1">
                Invoice #: {info.invoiceNumber}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Amount&nbsp;Due:</h6>
              <h5 className="fw-bold text-secondary"> {info.currency} {info.total}</h5>
            </div>
          </div>
          <div className="p-4">
            <Row className="mb-4">
            <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{info.billTo||''}</div>
                  <div>{info.billToAddress||''}</div>
                  <div>{info.billToEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{info.billFrom||''}</div>
                  <div>{info.billFromAddress||''}</div>
                  <div>{info.billFromEmail||''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{info.dateOfIssue||''}</div>
                </Col>
            </Row>
            <Table className="mb-0">
            <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => {
                    return (
                      <tr id={i} key={i}>
                        <td style={{width: '70px'}}>
                          {item.quantity}
                        </td>
                        <td>
                          {item.name} - {item.description}
                        </td>
                        <td className="text-end" style={{width: '100px'}}>{info.currency} {item.price}</td>
                        <td className="text-end" style={{width: '100px'}}>{info.currency} {item.price * item.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
            </Table>
            <Table>
            <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>SUBTOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{info.currency} {info.subTotal}</td>
                  </tr>
                  {info.taxAmmount !== 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>TAX</td>
                      <td className="text-end" style={{width: '100px'}}>{info.currency} {info.taxAmmount}</td>
                    </tr>
                  }
                  {info.discountAmmount !== 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{width: '100px'}}>DISCOUNT</td>
                      <td className="text-end" style={{width: '100px'}}>{info.currency} {info.discountAmmount}</td>
                    </tr>
                  }
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{width: '100px'}}>TOTAL</td>
                    <td className="text-end" style={{width: '100px'}}>{info.currency} {info.total}</td>
                  </tr>
                </tbody>
            </Table>
            {info.notes &&
              <div className="bg-light py-3 px-4 rounded">
                {info.notes}
              </div>}
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={AddInvoiceTostore}>
                  <BiPaperPlane style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />Add Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{ width: '16px', height: '16px', marginTop: '-3px' }} className="me-2" />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
      <hr className="mt-4 mb-3" />
    </div>
  );
}

export default InvoiceModal;