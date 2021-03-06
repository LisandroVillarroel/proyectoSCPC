import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { IArticuloOc, IDetalleOc1 } from 'src/app/interface/oc';
import { ComprasOcService } from 'src/app/servicios/compras-oc.service';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-consulta-occ',
  templateUrl: './consulta-oc.component.html',
  styleUrls: ['./consulta-oc.component.css']
})
export class ConsultaOcComponent implements AfterViewInit {


//datoConsultaPac:  IConsultaPac | undefined;

/*iDetalleOc1:IDetalleOc1={
  numeroOc:'',
  tipoDocAsoc:'',
  numDocAsoc: '',
  fechaSolicitud: '',
  empresa: '',
  rut: '',
  descripcion: '',
  dircEnvioFact: '',
  dircDespacho: '',
  formaPago: ''};
*/
iDetalleOc1: IDetalleOc1 = {
  numeroOc: '',
  tipoDocAsoc: '',
  numDocAsoc: '',
  fechaSolicitud: '',
  empresa: '',
  rut: '',
  descripcion: '',
  dircEnvioFact: '',
  dircDespacho: '',
  formaPago: ''
};

  displayedColumns: string[] = ['codigoArticulo', 'detalles',   'unidadMedida', 'cantidadTotal',  'valorUnitario',  'montoTotal'];
  dataSource: MatTableDataSource<IArticuloOc>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(public dialog: MatDialog,public httpClient: HttpClient
    ,private dialogRef: MatDialogRef<ConsultaOcComponent>
    , private comprasOcService:ComprasOcService
    ,@Inject(MAT_DIALOG_DATA) public data: any) {
      console.log('en consulta',data)

    // Create 100 users
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<IArticuloOc>();
  }


  ngOnInit() {

    this.getConsultaDetalleOc1();
  }


  getConsultaDetalleOc1() {
   console.log('data:',this.data)
    this.comprasOcService
    .getDataOcDetalle1(this.data.id, this.data.tipoSolicitud)
    .subscribe((res: {}) => {
      console.log('res oc1: ', res);
      if (res != null){
      this.iDetalleOc1 = res as IDetalleOc1;
      console.log('res oc1 Det: ', this.iDetalleOc1);
      }
      this.getConsultaDetalleOc2()
    },
    // console.log('yo:', res as PerfilI[]),
    error => {
      console.log('error carga:', error);
      Swal.fire(
        'ERROR INESPERADO',
        error,
       'info'
     );
    }
  );
  }


  getConsultaDetalleOc2() {
    console.log('paso pac')
    this.comprasOcService
    .getDataOcDetalle2(this.data.id)
    .subscribe((res: {}) => {
      console.log('suc2: ', res);
      if (res!=null){
      this.dataSource.data = res as IArticuloOc[];
      }
    },
    // console.log('yo:', res as PerfilI[]),
    error => {
      console.log('error carga:', error);
      Swal.fire(
        'ERROR INESPERADO',
        error,
       'info'
     );
    }
  );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }






  private refreshTable() {


   this.dataSource.paginator?._changePageSize(this.paginator.pageSize);
  }

  cerrar() {
    this.dialogRef.close();
  }
  getTotalCost() {
    return this.dataSource.data.map(t =>  parseInt(t.montoTotal)).reduce((acc, value) => acc + value, 0);
 }

  }


