import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Pressable } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { Formik } from 'formik'
import { getById, update } from '../../api/OrderEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'

export default function EditOrderScreen ({ navigation, route }) {
  const [order, setOrder] = useState({})
  const [initialValues, setInitialValues] = useState({ address: '', price: '' })
  const [backendErrors, setBackendErrors] = useState([])

  const validationSchema = yup.object().shape({
    address: yup.string().required('Address is required'),
    price: yup.number().required('Price is required').moreThan(0)
  })

  useEffect(() => {
    async function fetchOrder () {
      try {
        const fetchedOrder = await getById(route.params.orderId)
        setOrder(fetchedOrder)
        setInitialValues({
          address: fetchedOrder.address,
          price: fetchedOrder.price.toString()
        })
      } catch (error) {
        showMessage({
          message: `Error loading order ${route.params.orderId}. ${error}`,
          type: 'danger',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchOrder()
  }, [route.params.orderId])

  const updateOrder = async (values) => {
    setBackendErrors([])
    try {
      await update(order.id, values)
      showMessage({
        message: `Order ${order.id} updated successfully`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('OrdersScreen', { id: order.restaurantId, dirty: true })
    } catch (error) {
      setBackendErrors(error.errors || [])
    }
  }

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={updateOrder}
    >
      {({ handleSubmit }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem name="address" label="Address:" />
              <InputItem name="price" label="Price:" keyboardType="numeric" />

              {backendErrors.length > 0 &&
                backendErrors.map((error, index) => (
                  <TextError key={index}>{error.param} - {error.msg}</TextError>
                ))}

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}
              >
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="content-save" color="white" size={20} />
                  <TextRegular textStyle={styles.text}>Save</TextRegular>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  }
})
