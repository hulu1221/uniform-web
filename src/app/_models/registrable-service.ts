export class RegistrableService {
  action: string
  approveDate: string
  approvePriority: number
  description: string
  id: string
  processId: string
  receiveDate: string
  requestId: string
  sentDate: string
  statusId: string
  statusName: string

  constructor(service) {
    this.action = service.action
      this.approveDate = service.approveDate
        this.approvePriority = service.approvePriority
          this.description = service.description
            this.id = service.id
              this.processId = service.processId
                this.receiveDate = service.receiveDate
                  this.requestId = service.requestId
                    this.sentDate = service.sentDate
                      this.statusId = service.statusId
                        this.statusName = service.statusName
  }

  formatDate(date: string) {
    return date != '' ? date + 'T00:00:00' : null
  }
}
