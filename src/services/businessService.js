import {db} from '../firebase'
import{
    collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, runTransaction, serverTimestamp, increment
} from 'firebase/firestore'


export async function createBusiness(data){
    return await addDoc(collection(db, 'businesses'), {
        ...data,
        averageRating: 0,
        totalRatings: 0,
        ratingBreakdown: {1:0, 2:0, 3:0, 4:0, 5:0},
        createdAt: serverTimestamp()
    })
}

export async function getBusiness(businessId){
    const snap = await getDoc(doc(db, 'businesses', businessId))
    return {id: snap.id, ...snap.data()}
}

export async function getAllBusinesses() {
    const snap = await getDocs(collection(db, 'businesses'))
    return snap.docs.map(d => ({id: d.id, ...d.data()}))
}

export async function getBusinessByCategory(category){
    const q = query(
        collection(db, 'businesses'),
        where('category', '==', category)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d=>({id:d.id, ...d.data()}))
}


//reviews & ratings section

export async function submitReview(businessId, userId, userEmail, rating, title, body){
    const businessRef = doc(db, 'businesses', businessId)
    const reviewsRef = collection(db, 'businesses', businessId, 'reviews')

    await runTransaction(db, async(transaction)=>{
        const businessDoc = await transaction.get(businessRef)
        const data = businessDoc.data()

        const newTotal = data.totalRatings + 1
        const newAverage = ((data.averageRating * data.totalRatings) + rating)/newTotal

        transaction.update(businessRef, {
            averageRating: parseFloat(newAverage.toFixed(1)),
            totalRatings: newTotal,
            [`ratingBreakdown.${rating}`]: increment(1)
        })

        await addDoc(reviewsRef,{
            userId,
            userEmail,
            rating,
            title,
            body, 
            createdAt: serverTimestamp()
        })
    })
}

export async function getReviews(businessId){
    const q = query(
        collection(db, 'businesses'),
        where('businessId', '==', businessId)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({
        id: d.id, ...d.data()
    }))
}

export async function hasUserReviewed(businessId, userId){
    const q = query(
        collection(db, 'business', businessId, 'reviews'),
        where ('userId', '==', userId)
    )
    const snap = await getDocs(q)
    return !snap.empty //true if user alr left a review
}

//deals section
export async function addDeal(businessId, dealData){
    return await addDoc(collection(db, 'businesses', businessId, 'deals'), {
        ...dealData,
        isActive: true,
        createdAt: serverTimestamp()
    })
}

export async function getActiveDeals(businessId){
    const q = query(
        collection(db, 'businesses', businessId, 'deals'),
        where('isActive', '==', true),
        where('expiryDate', '>', new Date())
    )
}