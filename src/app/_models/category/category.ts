export class Category {
  id: string
  code: string
  name: string
  nameF: string
  constructor(item: any) {
    this.id = item.id
    this.code = item.code
    this.name = item.name
    this.nameF = this.nameF
  }
}
export class RegisType {
  createdBy: string
  createdDate: string
  displayPriority: number
  id: string
  modifiedBy: string
  modifiedDate: string
  name: string
  statusCode: string
  value: string
  constructor(item: any) {
    this.createdBy = item.createdBy
      this.createdDate = item.createdDate
        this.displayPriority = item.displayPriority
          this.id = item.id
              this.modifiedBy = item.modifiedBy
                this.modifiedDate = item.modifiedDate
                  this.name = item.name
                    this.statusCode = item.statusCode
                      this.value = item.value
  }
}
