export class DistrictRequest {
  cityId: string
  page: number = 1
  size: number = 1000
  constructor(cityId: string) {
    this.cityId = cityId
  }
}

export class WardRequest {
  districtId: string
  page: number = 1
  size: number = 1000
  constructor(districtId: string) {
    this.districtId = districtId
  }
}
