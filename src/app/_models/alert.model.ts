export enum AlertType {
  Error,
  Success
}

export interface Alert {
  type: AlertType

  title: string;
  message: string;
}
