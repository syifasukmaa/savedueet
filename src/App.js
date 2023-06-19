import React from 'react';
import './App.css';
import ModalCreate from './component/ModalCreate';
import Alert from './component/Alert';
import Button from 'react-bootstrap/esm/Button';

class App extends React.Component {
  documentData;
  constructor() {
    super();

    this.state = {
      sisaUang: 0,
      persentaseUang: 0,
      pemasukanUang: 0,
      pengeluaranUang: 0,
      transaksiIn: 0,
      transaksiOut: 0,
      summary: [],
    };
    this.tambahItem = this.tambahItem.bind(this);
    this.hapusLocalStorage = this.hapusLocalStorage.bind(this);
    this.merubahRupiah = this.merubahRupiah.bind(this);
  }

  tambahItem(obj) {
    let newData = [...this.state.summary, obj];
    let dataUangIN = newData.filter((item) => item.category === 'IN');
    let nominalUang = dataUangIN.map((item) => item.nominal);
    let jumlahUangIn = nominalUang.reduce((total, num) => total + num, 0);
    let dataUangOUT = newData.filter((item) => item.category === 'OUT');
    let nominalUangOut = dataUangOUT.map((item) => item.nominal);
    let jumlahUangOut = nominalUangOut.reduce((total, num) => total + num, 0);
    this.setState(
      {
        pemasukanUang: jumlahUangIn,
        transaksiIn: nominalUang.length,
        pengeluaranUang: jumlahUangOut,
        transaksiOut: nominalUangOut.length,
        sisaUang: jumlahUangIn - jumlahUangOut,
        persentaseUang: ((jumlahUangIn - jumlahUangOut) / jumlahUangIn) * 100,
        summary: newData,
      },
      () => {
        localStorage.setItem('savedueet', JSON.stringify(this.state));
      }
    );
  }

  merubahRupiah(nominalUang) {
    let nominal = nominalUang;
    let reverse = nominal.toString().split('').reverse().join('');
    let ribuan = reverse.match(/\d{1,3}/g);
    return ribuan.join('.').split('').reverse().join('');
  }

  hapusLocalStorage() {
    localStorage.removeItem('savedueet');
    this.setState({
      pemasukanUang: 0,
      transaksiIn: 0,
      pengeluaranUang: 0,
      transaksiOut: 0,
      sisaUang: 0,
      persentaseUang: 0,
      summary: [],
    });
  }

  componentDidMount() {
    if (this.state.summary.length < 1) {
      console.log('SaveDueet berjalan');
      this.documentData = JSON.parse(localStorage.getItem('savedueet'));
      if (localStorage.getItem('savedueet')) {
        this.setState({
          pemasukanUang: this.documentData.pemasukanUang,
          transaksiIn: this.documentData.transaksiIn,
          pengeluaranUang: this.documentData.pengeluaranUang,
          transaksiOut: this.documentData.transaksiOut,
          sisaUang: this.documentData.sisaUang,
          persentaseUang: this.documentData.persentaseUang,
          summary: this.documentData.summary,
        });
      }
    } else {
      this.tambahItem();
    }
  }
  render() {
    return (
      <>
        <div className="container py-4">
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="fw-bold">SAVEDUEET APP</h1>
              <hr className="w-75 mx-auto" />
              <h2 className="fw-bold">
                Rp. {this.merubahRupiah(this.state.sisaUang)} ,-
              </h2>
              <span className="title-md">
                Sisa uang kamu tersisa {this.state.persentaseUang} % lagi
              </span>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6 ">
              <div className="card-wrapper p-4">
                <div className="icon-wrapper mb-1">
                  <i className="bi bi-wallet2"></i>
                </div>
                <span className="title-sm">Pemasukan</span>
                <h3 className="fw-bold">
                  Rp.{this.merubahRupiah(this.state.pemasukanUang)},-{' '}
                </h3>
                <div>
                  <span className="title text-ungu fw-bold">
                    {this.state.transaksiIn}
                  </span>
                  <span className="title-sm"> Transaksi</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-2 mt-md-0">
              <div className="card-wrapper p-4">
                <div className="icon-wrapper mb-1">
                  <i className="bi bi-wallet2"></i>
                </div>
                <span className="title-sm">Pengeluaran</span>
                <h3 className="fw-bold">
                  Rp. {this.merubahRupiah(this.state.pengeluaranUang)},-
                </h3>
                <div>
                  <span className="title text-ungu fw-bold">
                    {this.state.transaksiOut}{' '}
                  </span>
                  <span className="title-sm">Transaksi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-3 mt-md-5">
            <div className="btn-transaksi col-12 d-flex justify-content-between align-items-center">
              <h4>Ringkasan Transaksi</h4>
              <div className="wrapper-button d-flex">
                <ModalCreate
                  action={this.tambahItem}
                  category="IN"
                  variant="button btn-ungu px-3 py-2 me-2"
                  text="Pemasukan"
                  icon="bi bi-plus-circle-fill"
                  modalheading="Tambahkan Pemasukan"
                />
                <ModalCreate
                  action={this.tambahItem}
                  category="OUT"
                  variant="button btn-pink px-3 py-2"
                  text="Pengeluaran"
                  icon="bi bi-dash-circle-fill"
                  modalheading="Tambahkan Pengeluaran"
                />
                <Button
                  className="button btn-danger px-3 py-2 ms-2"
                  onClick={this.hapusLocalStorage}
                >
                  Hapus <i className="bi bi-x-circle"></i>
                </Button>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            {this.state.summary.length < 1 ? <Alert /> : null}
            {this.state.summary.map((sum, index) => {
              return (
                <div
                  key={index}
                  className="mb-3 col-12 d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <div
                      className={
                        sum.category === 'IN'
                          ? 'icon-wrapper-IN'
                          : 'icon-wrapper-OUT'
                      }
                    >
                      <i
                        className={
                          sum.category === 'IN'
                            ? 'bi bi-wallet2'
                            : 'bi bi-bag-dash'
                        }
                      ></i>
                    </div>
                    <div className="transaction ms-3 d-flex flex-column">
                      <h6>{sum.deskripsi}</h6>
                      <span className="title-sm">{sum.tanggal}</span>
                    </div>
                  </div>

                  <h5
                    className={
                      sum.category === 'IN' ? 'text-money-in' : 'text-money-out'
                    }
                  >
                    Rp. {this.merubahRupiah(sum.nominal)}
                  </h5>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default App;
