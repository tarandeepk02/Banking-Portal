// "dev": "npx parcel watch src/index.js src/style.css --dist-dir ../server/public",
const InternalTransferForm = ({ form, onChange, onSubmit, accounts = [] }) => (
  <form onSubmit={onSubmit}>
    <h5>Transfer Between My Accounts</h5>
    <div className="row">
      <div className="col-md-3">
        <label>Sender Account<span className="text-danger">*</span></label>
        <select
          name="senderAccount"
          className="form-select"
          value={form.senderAccount}
          onChange={onChange}
          required
        >
          <option value="">Select sender account</option>
          {accounts.map((acc, idx) => (
            <option key={idx} value={acc.accountNumber}>
              {acc.accountType} - {acc.accountNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label>Receiver Account<span className="text-danger">*</span></label>
        <select
          name="receiverAccount"
          className="form-select"
          value={form.receiverAccount}
          onChange={onChange}
          required
        >
          <option value="">Select receiver account</option>
          {accounts.map((acc, idx) => (
            <option key={idx} value={acc.accountNumber}>
              {acc.accountType} - {acc.accountNumber}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label>Amount<span className='text-danger'>*</span></label>
        <input
          type="number"
          className="form-control"
          name="amount"
          value={form.amount}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-3">
        <button type="submit" className="btn btn-secondary mt-4">Transfer Internally</button>
      </div>
    </div>
  </form>
);

const ExternalTransferForm = ({ form, onChange, onSubmit, accounts = [] }) => (
  <form onSubmit={onSubmit}>
    <h5>Send an Interac e-Transfer</h5>
    <div className="row">
      <div className="col-md-3">
        <label>Sender Account<span className='text-danger'>*</span></label>
        <select
          name="senderAccount"
          className="form-select"
          value={form.senderAccount}
          onChange={onChange}
          required
        >
           <option value="">Select sender account</option>
  {accounts.map((acc, idx) => (
    <option key={idx} value={acc.accountType}>
      {acc.accountType} - {acc.accountNumber}
    </option>
  ))}
        </select>
      </div>

      <div className="col-md-3">
        <label>Receiver Email<span className='text-danger'>*</span></label>
        <input
          type="email"
          className="form-control"
          name="receiverEmail"
          value={form.receiverEmail}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-3">
        <label>Amount<span className='text-danger'>*</span></label>
        <input
          type="number"
          className="form-control"
          name="amount"
          value={form.amount}
          onChange={onChange}
          required
        />
      </div>

      <div className="col-md-3">
        <button type="submit" className="btn btn-secondary mt-4">Transfer Externally</button>
      </div>
    </div>
  </form>
);
  
  export  {InternalTransferForm,ExternalTransferForm};
  
    
