import { get, post, put, destroy } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}

function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}

function create (data) {
  return post('restaurants', data)
}

function update (id, data) {
  return put(`restaurants/${id}`, data)
}

function remove (id) {
  return destroy(`restaurants/${id}`)
}

function getRestaurantOrders (restaurantId) {
  return get(`/restaurants/${restaurantId}/orders`)
}

function getRestaurantAnalytics (restaurantId) {
  // SOLUTION. Excercise - Restaurant analytics
  return get(`/restaurants/${restaurantId}/analytics`)
}

export { getRestaurantOrders, getRestaurantAnalytics, getAll, getDetail, getRestaurantCategories, create, update, remove }
