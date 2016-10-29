/**
 * Created by nariyoon on 2016. 10. 25..
 */
import Hamming from '../modules/HammingDistCalculator'
import Gimci from '../modules/Gimci'
import AT from '../constants/ActionTypes'

export function calculate(text1, text2) {
  return {
    types: [AT.HAMMING_CALC_REQUEST, AT.HAMMING_CALC_SUCCESS, AT.HAMMING_CALC_FAILURE],
    promise: () => {

      return new Promise((resolve, reject) => {

        resolve(Hamming(text1, text2))
      })
    }
  }
}
