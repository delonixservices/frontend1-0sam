import { Component, OnInit, OnDestroy, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Options, LabelType } from 'ng5-slider';
import { Subject } from 'rxjs';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-hotel-search-filters',
  templateUrl: './hotel-search-filters.component.html',
  styleUrls: ['./hotel-search-filters.component.css']
})
export class HotelSearchFiltersComponent implements OnInit, OnDestroy, OnChanges {

  @Output() filtersChange = new EventEmitter();
  @Input() minHotelPrice: number;
  @Input() maxHotelPrice: number;

  public onChanges = new Subject<SimpleChanges>();

  norecordfoundtitle;
  norecordfoundmsg;

  allHotel: any;

  public filters = {
    roomType: [],
    roomView: [],
    priceRange:[],
    roomAmenities:[],
    chains:[],
    propertyType:[],
    foodType: [],
    refundable: [],
    starRating: [],
    price: {
      min: 0,
      max: 100000
    }
  };

  public filteredHotels = [];
  public copyFilteredHotels = [];

  public minPrice: number;
  public maxPrice: number;

  public priceRange = [
    { name: "Upto Rs 2000", selected: false, value: { min: 0, max: 2000 } },
    { name: "Rs 2000  to  Rs 5000", selected: false, value: { min: 2000, max: 5000 } },
    { name: "Rs 5000  to  Rs 8000", selected: false, value: { min: 5000, max: 8000 } },
    { name: "Rs 8000  to  Rs 15000", selected: false, value: { min: 8000, max: 15000 } },
    { name: "Rs 15000+", selected: false, value: { min: 15000, max: 100000 } },
  ]

  public RoomTypeFilters = [
    { name: "All", selected: true, value: ["Standard", "Deluxe", "Superior", "Triple"] },
    { name: "Standard", selected: false, value: "Standard" },
    { name: "Deluxe", selected: false, value: "Deluxe" },
    { name: "Superior", selected: false, value: "Superior" },
    { name: "Triple", selected: false, value: "Triple" },
  ]
  public PropertyTypeFilters = [
    { name: "Hotel", selected: false, value: "Hotel" },
    { name: "Homestay", selected: false, value: "Homestay" },
    { name: "Guest House", selected: false, value: "Guest House" },
    { name: "Apartment", selected: false, value: "Apartment" },
  ]
  public RoomViews = [
    { name: "Garden View", selected: false, value: "Garden View" },
    { name: "City View", selected: false, value: "City View" },
  ]
  public RoomAmenities = [
    { name: "Home Theatre", selected: false, value: "Home Theatre" },
    { name: "Fireplace", selected: false, value: "Fireplace" },
    { name: "Balcony", selected: false, value: "Balcony" },
    { name: "Living Area", selected: false, value: "Living Area" },
    { name: "Spa Tub", selected: false, value: "Spa Tub" },
    { name: "Heater", selected: false, value: "Heater" },
  ]
  public Chains = [
    { name: "Bloom Hotels", selected: false, value: "Bloom Hotels" },
    { name: "Hyatt", selected: false, value: "Hyatt" },
    { name: "Lemon Tree", selected: false, value: "Lemon Tree" },
    { name: "The Oberoi", selected: false, value: "The Oberoi" },
    { name: "Oyo Hotels", selected: false, value: "Oyo Hotels" },
    { name: "Radisson Blu", selected: false, value: "Radisson Blu"},
  ]
  public FoodTypeFilters = [
    { name: "All", selected: false, value: ["Room Only", "Breakfast", "Lunch", "Dinner", "Half board", "Full board", "All inclusive"] },
    { name: "Room Only", selected: false, value: 1 },
    { name: "Breakfast", selected: false, value: 2 },
    { name: "Lunch", selected: false, value: 3 },
    { name: "Dinner", selected: false, value: 4 },
    { name: "Half board", selected: false, value: 5 },
    { name: "Full board", selected: false, value: 6 },
    { name: "All inclusive", selected: false, value: 7 },
  ]

  public Refundable = [
    { name: "All", selected: true, value: [true, false] },
    { name: "Yes", selected: false, value: true },
    { name: "No", selected: false, value: false },
  ]

  public startRating = [
    { name: "1 Star", selected: false, value: "1" },
    { name: "2 Star", selected: false, value: "2" },
    { name: "3 Star", selected: false, value: "3" },
    { name: "4 Star", selected: false, value: "4" },
    { name: "5 Star", selected: false, value: "5" },
    { name: "Unrated", selected: false, value: "0" },
  ]

  searchText = '';

  options: Options;

  constructor (private sharedService: SharedService) { }
 
  ngOnInit() {
    this.sharedService.responseData$.subscribe(data => {
      if (data) {
        console.log(data);
      }
    });
    if (!this.minHotelPrice) {
      this.minHotelPrice = 0;
    }
    if (!this.maxHotelPrice) {
      this.maxHotelPrice = 100000;
    }

    this.minHotelPrice = Math.floor(this.minHotelPrice / 1000) * 1000;
    this.maxHotelPrice = Math.ceil(this.maxHotelPrice / 1000) * 1000;

    console.log(this.minHotelPrice, this.maxHotelPrice);

    this.minPrice = this.minHotelPrice;
    this.maxPrice = this.maxHotelPrice;
    this.options = {
      floor: this.minHotelPrice,
      ceil: this.maxHotelPrice,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min:</b> &#8377;' + value;
          case LabelType.High:
            return '<b>Max:</b> &#8377;' + value;
          default:
            return '&#8377;' + value;
        }
      }
    };

    this.onChanges.subscribe((changes: SimpleChanges) => {
      let minHotelPrice;
      let maxHotelPrice;
      if (changes.minHotelPrice) {
        minHotelPrice = changes.minHotelPrice.currentValue;
      } else {
        minHotelPrice = 0;
      }
      if (changes.maxHotelPrice) {
        // Rounding up to the nearest 100
        maxHotelPrice = Math.ceil(changes.maxHotelPrice.currentValue / 1000) * 100000;
        console.log(maxHotelPrice);
      } else {
        maxHotelPrice = 100000;
      }
      const options = {
        floor: minHotelPrice,
        ceil: maxHotelPrice,
        translate: this.options.translate
      }

      // reassign floor and ceil for dynamic floor and ceil to work
      this.options = options;
    });

    console.log(this.options);
  }

  ngOnChanges(changes: SimpleChanges) {
    // emit any new changes
    this.onChanges.next(changes);

    // if (changes["minHotelPrice"].isFirstChange() && changes["maxHotelPrice"].isFirstChange()) {
    // }
  }

  priceFilter() {
    this.filters.price.min = this.minPrice;
    this.filters.price.max = this.maxPrice;

    this.filtersChange.emit(this.filters);
  }

  // priceFilter() {
  //   this.filteredHotels = JSON.parse(JSON.stringify(this.copyFilteredHotels));

  //   this.filteredHotels = this.filteredHotels.filter((hotel) => {
  //     const chargeable_rate = hotel.rates.packages[0].chargeable_rate;
  //     return chargeable_rate >= this.minHotelPrice && chargeable_rate <= this.maxHotelPrice;
  //   });
  //   // console.log(this.filteredHotels);
  //   if (this.filteredHotels.length <= 0) {
  //     this.norecordfoundtitle = "There is no Hotel available currently. Please search for other hotels";
  //   } else {
  //     this.norecordfoundtitle = "";
  //   }
  // }

  sideBarFilter() {
    setTimeout(() => {
      let priceRangeFilter = [];
      for (let index = 0; index < this.priceRange.length; index++) {
        const element = this.priceRange[index];
        if (element.name === 'All') {
          continue;
        }
        if (element.selected === true) {
          priceRangeFilter.push(element.value);
        }
      }

      if (priceRangeFilter.length > 0) {
        let min, max = 0;
        priceRangeFilter.forEach((el, i) => {
          if (i === 0) {
            min = el.min;
          } else if (el.min < min) {
            min = el.min
          }
          if (el.max > max) {
            max = el.max;
          }
        });
        this.filters.price.min = min;
        this.filters.price.max = max;
        const options = {
          floor: min,
          ceil: max,
          translate: this.options.translate
        }
        // reassign floor and ceil for dynamic floor and ceil to work
        this.options = options;
        console.log(this.filters);
      } else {
        this.filters.price.min = 0;
        this.filters.price.max = 100000;
      }

      let roomTypeFilter = [];
      for (let index = 0; index < this.RoomTypeFilters.length; index++) {
        const element = this.RoomTypeFilters[index];
        if (element.name === 'All') {
          continue;
        }
        if (element.selected === true) {
          roomTypeFilter.push(element.value);
        }
      }

      if (roomTypeFilter.length > 0) {
        this.filters.roomType = roomTypeFilter;
        console.log(this.filters);
      } else {
        this.filters.roomType = [];
      }
      let roomViewFilter = [];
      for(let index = 0; index <this.RoomViews.length;index++){
        const element = this.RoomViews[index];
        if(element.selected === true){
          roomViewFilter.push(element.value);
        }
      }
      if(roomViewFilter.length > 0){
        this.filters.roomView = roomViewFilter;
        console.log(this.filters);
      }else{
        this.filters.roomView = [];
      }
      let roomAmenities = [];
      for(let index = 0; index < this.RoomAmenities.length;index++){
        const element = this.RoomAmenities[index];
        if(element.selected === true){
          roomAmenities.push(element.value);
        }
      }
      if(roomAmenities.length > 0){
        this.filters.roomAmenities = roomAmenities;
      }else{
        this.filters.roomAmenities = [];
      }
      let propertyTypeFilter = [];
      for(let index = 0; index < this.PropertyTypeFilters.length;index++){
        const element = this.PropertyTypeFilters[index];
        if(element.selected === true){
          propertyTypeFilter.push(element.value);
        }
      }
      if(propertyTypeFilter.length > 0){
        this.filters.propertyType= propertyTypeFilter;
        console.log(this.filters);
        
      }else{
        this.filters.propertyType = [];
      }
      let foodTypeFilter = [];
      for (let index = 0; index < this.FoodTypeFilters.length; index++) {
        const element = this.FoodTypeFilters[index];
        if (element.name === 'All') {
          continue;
        }
        if (element.selected === true) {
          foodTypeFilter.push(element.value);
        }
      }

      if (foodTypeFilter.length > 0) {
        this.filters.foodType = foodTypeFilter;
        console.log(this.filters);
      } else {
        this.filters.foodType = [];
      }
      let chainFilter = [];
      for(let index=0; index < this.Chains.length;index++){
        const element = this.Chains[index];
        if(element.selected === true){
          chainFilter.push(element.value);
        }
      }
      if(chainFilter.length > 0){
        this.filters.chains = chainFilter;
      }else{
        this.filters.chains = [];
      }
      const refundableFilter = [];
      for (let index = 0; index < this.Refundable.length; index++) {
        const element = this.Refundable[index];
        if (element.name === 'All') {
          continue;
        }
        if (element.selected === true) {
          refundableFilter.push(element.value);
        }
      }

      if (refundableFilter.length > 0) {
        this.filters.refundable = refundableFilter;
      } else {
        this.filters.refundable = [];
      }

      const startRatingFilter = [];
      for (let index = 0; index < this.startRating.length; index++) {
        const element = this.startRating[index];
        if (element.selected === true) {
          startRatingFilter.push(element.value);
        }
      }

      if (startRatingFilter.length > 0) {
        this.filters.starRating = startRatingFilter;
      } else {
        this.filters.starRating = [];
      }

      if (this.searchText) {
        this.filteredHotels = this.filteredHotels.filter(hotel => {
          return hotel && hotel.originalName.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1;
        });
      }
      this.filtersChange.emit(this.filters);
    }, 0);
  }
  getSelectedTypes(filterType: string): string[] {
    const selectedFilters = this.filters[filterType];
    return selectedFilters;
  }
  clearAllFilters() {
    for (let filterType of ['roomType','roomView','foodType','refundable','starRating','roomAmenities','chains','propertyType']) {
      this.filters[filterType] = [];
      this.uncheckAllCheckboxes(filterType);
    }

    // Reset other filter properties if needed
    this.filters.price = { min: 0, max: 100000 };

    // Emit the updated filters to notify other components about the change
    this.filtersChange.emit(this.filters);
  }
  uncheckAllCheckboxes(filterType: string) {
    const filterArray = this.getFiltersArray(filterType);
  
    if (filterArray) {
      filterArray.forEach((checkbox) => {
        checkbox.selected = false;
      });
    }
  }
  
  getFiltersArray(filterType: string): any[] | null {
    switch (filterType) {
      case 'roomType':
        return this.RoomTypeFilters;
      case 'roomView':
        return this.RoomViews;
      case 'propertyType':
        return this.PropertyTypeFilters;
      case 'roomAmenities':
        return this.RoomAmenities;
      case 'chains':
        return this.Chains;
      case 'foodType':
        return this.FoodTypeFilters;
      case 'refundable':
        return this.Refundable;
      case 'starRating':
        return this.startRating;
      default:
        return null;
    }
  }
  removeFilter(filterType: string, selectedFilter: string) {
    const index = this.filters[filterType].indexOf(selectedFilter);
    if (index !== -1) {
      this.filters[filterType].splice(index, 1);
    }

    this.uncheckCheckbox(filterType, selectedFilter);
    this.filtersChange.emit(this.filters);
  }
  uncheckCheckbox(filterType: string, selectedFilter: string) {
    const filterArray = this.getFilterArray(filterType);
  
    if (filterArray) {
      const checkbox = filterArray.find((filter) => filter.name === selectedFilter);
      
      if (checkbox) {
        checkbox.selected = false;
      }
    }
  }


  //  -----------------------  sorting the hotel according to the name or price ------------------------

  // Initialize selectedSortOption with a default value
// selectedSortOption: string = 'name'; // Default is 'name' or 'price'

// // Function to handle sorting
// sortHotels() {
//   if (this.selectedSortOption === 'name') {
//     this.hotels = this.hotels.sort((a, b) => {
//       return a.name.localeCompare(b.name);
//     });
//   } else if (this.selectedSortOption === 'price') {
//     this.hotels = this.hotels.sort((a, b) => {
//       return a.price - b.price; // Ascending order by price
//     });
//   }
// }

  
  getFilterArray(filterType: string): any[] | null {
    switch (filterType) {
      case 'roomType':
        return this.RoomTypeFilters;
      case 'roomView':
        return this.RoomViews;
      case 'propertyType':
        return this.PropertyTypeFilters;
      case 'roomAmenities':
        return this.RoomAmenities;
      case 'chains':
        return this.Chains;
      case 'foodType':
        return this.FoodTypeFilters;
      case 'refundable':
        return this.Refundable;
      case 'starRating':
        return this.startRating;
      default:
        return null;
    }
  }


  // FilterHotels() {
  //   var refund;
  //   var roomtype;
  //   var foodserve; 
  //   var i = 0;
  //   setTimeout(() => {
  //     for (let refundtype of this.Refundable) {
  //       if (i == 0) {
  //         if (refundtype.selected === true) {
  //           refund = refundtype.value;
  //           break;
  //         }
  //       } else {
  //         if (refundtype.selected === true) {
  //           refund.push(refundtype.value);
  //         }
  //       }
  //       i++;
  //     }

  //     i = 0;
  //     this.RoomTypeFilters.map((type, index) => {
  //       console.log(index);
  //       console.log(type);
  //       if (index == 0) {
  //         if (type.selected == true) {
  //           roomtype = type.value;
  //           return true;
  //         }
  //       } else {
  //         if (type.selected == true) {
  //           roomtype.push(type.value);
  //         }
  //         this.norecordfoundtitle = "Opps";
  //         this.norecordfoundmsg = "No Room available currently, Please look for some other option";
  //       }

  //     });
  //     // for(let type of this.RoomTypeFilters; let){
  //     // 	if(i == 0){
  //     // 		if(type.selected == true){
  //     // 			roomtype = type.value;
  //     // 			break;
  //     // 		}

  //     // 	}else{
  //     // 		if(type.selected == true){
  //     // 			roomtype.push(type.value);	
  //     // 		}
  //     // 	}
  //     // 	i++;
  //     // }

  //     // i = 0;
  //     // for (let food of this.FoodServerd) {
  //     //   if (i == 0) {
  //     //     if (food.selected === true) {
  //     //       foodserve = food.value;
  //     //       break;
  //     //     }
  //     //   } else {
  //     //     if (food.selected === true) {
  //     //       foodserve.push(food.value);
  //     //     }
  //     //   }
  //     //   i++;
  //     // }

  //     // this.filteredHotels =  this.allHotel.hotels.filter(function(hotel) {
  //     this.filteredHotels = this.allHotel.filter(function (hotel) {
  //       // return true;
  //       return (roomtype.indexOf(hotel.rates.packages[0].room_details.room_type) > -1) && (foodserve.indexOf(hotel.rates.packages[0].room_details.food) > -1);
  //     });
  //   }, 200)
  // }

  // SearchFilter() {
  //   this.FilterHotels();
  // }

  ngOnDestroy() {
    this.onChanges.complete();
  }

}


