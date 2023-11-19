import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

const InvoiceForm = ({formdata}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState(formdata!==undefined?formdata?.currency:'$');
  const [dateOfIssue, setDateOfIssue] = useState(formdata!==undefined?formdata?.dateOfIssue:'');
  const [invoiceNumber, setInvoiceNumber] = useState(formdata!==undefined?formdata?.invoiceNumber:1);
  const [billTo, setBillTo] = useState(formdata!==undefined?formdata?.billTo:'');
  const [billToEmail, setBillToEmail] = useState(formdata!==undefined?formdata?.billToEmail:'');
  const [billToAddress, setBillToAddress] = useState(formdata!==undefined?formdata?.billToAddress:'');
  const [billFrom, setBillFrom] = useState(formdata!==undefined?formdata?.billFrom:'');
  const [billFromEmail, setBillFromEmail] = useState(formdata!==undefined?formdata?.billFromEmail:'');
  const [billFromAddress, setBillFromAddress] = useState(formdata!==undefined?formdata?.billFromAddress:'');
  const [notes, setNotes] = useState(formdata!==undefined?formdata?.notes:'');
  const [total, setTotal] = useState(
    formdata !== undefined ? parseFloat(formdata?.total)  : 0.00
  );
  const [subTotal, setSubTotal] = useState(
    formdata !== undefined ? parseFloat(formdata?.subTotal) : 0.00
  );
  const [taxRate, setTaxRate] = useState(formdata!==undefined?formdata?.taxRate:'');
  const [taxAmount, setTaxAmount] = useState(
    formdata !== undefined ? parseFloat(formdata?.taxAmount): 0.00
  );
  const [discountRate, setDiscountRate] = useState(formdata!==undefined?formdata?.discountRate:'');
  const [discountAmount, setDiscountAmount] = useState(
    formdata !== undefined ? parseFloat(formdata?.discountAmount) : 0.00
  );
  const [items, setItems] = useState(formdata?.items && formdata.items.length>0?formdata.items[0]:[]);
  const id=formdata?.id?formdata?.id:"";
  // console.log(items);
  useEffect(() => {
    handleCalculateTotal();
  }, []);

  const handleRowDel = (itemToDelete) => {
    const updatedItems = items.filter((item) => item !== itemToDelete);
    setItems(updatedItems);
    handleCalculateTotal();
  };

  const handleAddEvent = () => {
    const id = (new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleCalculateTotal = () => {
    let subTotalValue = 0;

    items.forEach((item) => {
      subTotalValue += parseFloat((parseFloat(item.price).toFixed(2) * item.quantity).toFixed(2));
    });

    setSubTotal(parseFloat(Number(subTotalValue)).toFixed(2));
    setTaxAmount(parseFloat(subTotalValue * (taxRate / 100)).toFixed(2));
    setDiscountAmount(parseFloat(subTotalValue * (discountRate / 100)).toFixed(2));
    setTotal((subTotalValue - discountAmount + parseFloat(taxAmount)).toFixed(2));
  };

  const onItemizedItemEdit = (event) => {
    const { id, name, value } = event.target;
    const updatedItems = items.map((item) => {
      for (const key in item) {
        if (key === name && item.id === id) {
          item[key] = value;
        }
      }
      return item;
    });
    setItems(updatedItems);
    handleCalculateTotal();
  };

  const editField = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'taxRate':
        setTaxRate(value);
        break;
      case 'discountRate':
        setDiscountRate(value);
        break;
      case 'dateOfIssue':
        setDateOfIssue(value);
        break;
      case 'invoiceNumber':
        setInvoiceNumber(value);
        break;
      case 'billTo':
        setBillTo(value);
        break;
      case 'billToEmail':
        setBillToEmail(value);
        break;
      case 'billToAddress':
        setBillToAddress(value);
        break;
      case 'billFrom':
        setBillFrom(value);
        break;
      case 'billFromEmail':
        setBillFromEmail(value);
        break;
      case 'billFromAddress':
        setBillFromAddress(value);
        break;
      default:
        setNotes(value);
        break;
    }
    handleCalculateTotal();
  };

  const onCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const openModal = (event) => {
    event.preventDefault();
    handleCalculateTotal();
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <Form onSubmit={openModal}>
      <Row>
        <Col md={8} lg={9}>
          <Card className="p-4 p-xl-5 my-3 my-xl-4">
            <div className="d-flex flex-row align-items-start justify-content-between mb-3">
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <div class="mb-2">
                    <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                  <Form.Control type="date" value={dateOfIssue} name={"dateOfIssue"} onChange={(event) => editField(event)} style={{
                    maxWidth: '150px'
                  }} required="required" />
                </div>
              </div>
              <div className="d-flex flex-row align-items-center">
                <span className="fw-bold me-2">Invoice&nbsp;Number:&nbsp;</span>
                <Form.Control type="number" value={invoiceNumber} name={"invoiceNumber"} onChange={(event) => editField(event)} min="1" style={{
                  maxWidth: '70px'
                }} required="required" />
              </div>
            </div>
            <hr className="my-4" />
            <Row className="mb-5">
              <Col>
                <Form.Label className="fw-bold">Bill to:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice to?"}
                  rows={3}
                  value={billTo}
                  type="text"
                  name="billTo"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control placeholder={"Email address"} value={billToEmail} type="email" name="billToEmail" className="my-2" onChange={(event) => editField(event)} autoComplete="email" required="required" />
                <Form.Control placeholder={"Billing address"} value={billToAddress} type="text" name="billToAddress" className="my-2" autoComplete="address" onChange={(event) => editField(event)} required="required" />

              </Col>
              <Col>
                <Form.Label className="fw-bold">Bill from:</Form.Label>
                <Form.Control
                  placeholder={"Who is this invoice from?"}
                  rows={3}
                  value={billFrom}
                  type="text"
                  name="billFrom"
                  className="my-2"
                  onChange={(event) => editField(event)}
                  autoComplete="name"
                  required="required"
                />
                <Form.Control placeholder={"Email address"} value={billFromEmail} type="email" name="billFromEmail" className="my-2" onChange={(event) => editField(event)} autoComplete="email" required="required" />
                <Form.Control placeholder={"Billing address"} value={billFromAddress} type="text" name="billFromAddress" className="my-2" autoComplete="address" onChange={(event) => editField(event)} required="required" />

              </Col>
            </Row>
            <InvoiceItem
              onItemizedItemEdit={onItemizedItemEdit}
              onRowAdd={handleAddEvent}
              onRowDel={handleRowDel}
              currency={currency}
              items={items}
            />
            <Row className="mt-4 justify-content-end">
              <Col lg={6}>
                <div className="d-flex flex-row align-items-start justify-content-between">
                  <span className="fw-bold">Subtotal:</span>
                  <span>
                    {currency}
                    {subTotal}
                  </span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Discount:</span>
                  <span>
                    <span className="small ">({discountRate || 0}%)</span>
                    {currency}
                    {discountAmount || 0}</span>
                </div>
                <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                  <span className="fw-bold">Tax:
                  </span>
                  <span>
                    <span className="small ">({taxRate || 0}%)</span>
                    {currency}
                    {taxAmount || 0}</span>
                </div>
                <hr />
                <div className="d-flex flex-row align-items-start justify-content-between" style={{
                  fontSize: '1.125rem'
                }}>
                  <span className="fw-bold">Total:
                  </span>
                  <span className="fw-bold">{currency}
                    {total }</span>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={4} lg={3}>
          <div className="sticky-top pt-md-3 pt-xl-4">
            <Button variant="primary" type="submit" className="d-block w-100">
              Review Invoice
            </Button>
            <InvoiceModal
              showModal={isOpen}
              closeModal={closeModal}
              id={id}
              info={{
                currency,
                dateOfIssue,
                invoiceNumber,
                billTo,
                billToEmail,
                billToAddress,
                billFrom,
                billFromEmail,
                billFromAddress,
                notes,
                total,
                subTotal,
                taxRate,
                taxAmount,
                discountRate,
                discountAmount,
              }}
              items={items}
            />
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Currency:</Form.Label>
              <Form.Select
                onChange={(event) => onCurrencyChange(event)}
                className="btn btn-light my-1"
                aria-label="Change Currency"
              >
                <option value="$">USD (United States Dollar)</option>
                <option value="£">GBP (British Pound Sterling)</option>
                <option value="¥">JPY (Japanese Yen)</option>
                <option value="$">CAD (Canadian Dollar)</option>
                <option value="$">AUD (Australian Dollar)</option>
                <option value="$">SGD (Signapore Dollar)</option>
                <option value="¥">CNY (Chinese Renminbi)</option>
                <option value="₿">BTC (Bitcoin)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Tax rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(event) => editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label className="fw-bold">Discount rate:</Form.Label>
              <InputGroup className="my-1 flex-nowrap">
                <Form.Control
                  name="discountRate"
                  type="number"
                  value={discountRate}
                  onChange={(event) => editField(event)}
                  className="bg-white border"
                  placeholder="0.0"
                  min="0.00"
                  step="0.01"
                  max="100.00"
                />
                <InputGroup.Text className="bg-light fw-bold text-secondary small">
                  %
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InvoiceForm;


