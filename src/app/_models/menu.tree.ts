import {BehaviorSubject} from 'rxjs';
import {AccountModel} from './account';

export class TreeNode {
  children: BehaviorSubject<TreeNode[]>;
  data: any
  constructor(public item: string, public treeItem: TreeItem,children?: TreeNode[], public parent?: TreeNode) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
    this.data = treeItem
  }
  getRouter() {
    return this.treeItem.getRouter()
  }
}
export class TreeItem {
  parentLink: string
  routerLink: string
  processId: string
  id: string
  constructor(routerLink: string = '', processId: string = '', id: string = '') {
    this.routerLink = routerLink
    this.processId = processId
    this.id = id
  }
  getRouter() {
    if (this.id != '' && this.processId != '') {
      return [this.routerLink, {processId: this.processId, id: this.id}]
    } else if (this.id == '' && this.processId != '') {
      return [this.routerLink, {processId: this.processId}]
    }
    else return ['fileProcessed']
  }
}

export class MenuTree {
  generalInformation: TreeNode = new TreeNode('Thông tin chung', new TreeItem('generalInformation'))
  customer: TreeNode = new TreeNode('Khách hàng', new TreeItem('customer'))
  servicePack: TreeNode = new TreeNode('Gói dịch vụ', new TreeItem('servicePack'))
  account: TreeNode = new TreeNode('Tài khoản', new TreeItem('account'))
  eBanking: TreeNode = new TreeNode('E-Banking', new TreeItem('ebanking'))
  smsBanking: TreeNode = new TreeNode('SMS Banking', new TreeItem('smsBanking'))
  card: TreeNode = new TreeNode('Thẻ', new TreeItem('card'),[
    new TreeNode('Thẻ con 1 //todo', new TreeItem('card1'))
  ])
  printForm: TreeNode = new TreeNode('Biểu mẫu', new TreeItem('form'))
  attachDocument: TreeNode = new TreeNode('Tài liệu đính kèm', new TreeItem('document'))
  signature: TreeNode = new TreeNode('Chữ ký', new TreeItem('signature'))
  sendForApproval: TreeNode = new TreeNode('Gửi duyệt', new TreeItem('confirm'))
  approvalInformation: TreeNode = new TreeNode('Thông tin gửi duyệt', new TreeItem('service-approval'))

  setProcessId(processId: string) {
    this.generalInformation.treeItem.processId = processId
    this.customer.treeItem.processId = processId
    this.servicePack.treeItem.processId = processId
    this.account.treeItem.processId = processId
    this.eBanking.treeItem.processId = processId
    this.smsBanking.treeItem.processId = processId
    this.card.treeItem.processId = processId
    this.printForm.treeItem.processId = processId
    this.attachDocument.treeItem.processId = processId
    this.signature.treeItem.processId = processId
    this.sendForApproval.treeItem.processId = processId
    this.approvalInformation.treeItem.processId = processId
  }
  setAccountList(accounts: AccountModel[]) {
    this.account.item = `Tài khoản (${accounts.length})`
    let lst = accounts.map((item, index) => {
       return new TreeNode(`Tài khoản mới ${index + 1}`,
         new TreeItem('detailAccount', this.account.treeItem.processId, item.id), [
           new TreeNode('Đồng sở hữu',
             new TreeItem('co-owner', this.account.treeItem.processId, item.id),
             // [new TreeNode('OANH1', new TreeItem('oanh1'))]
           ),
           new TreeNode('Ủy quyền', new TreeItem('authority', this.account.treeItem.processId, item.id)),
         ])
    })
    this.account.children = new BehaviorSubject(lst);
  }
  getTree() {
    return [
      this.generalInformation,
      this.customer,
      this.servicePack,
      this.account,
      this.eBanking,
      this.smsBanking,
      this.card,
      this.printForm,
      this.attachDocument,
      this.signature,
      this.sendForApproval,
      this.approvalInformation,
    ]
  }
}
