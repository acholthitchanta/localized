import {db, storage} from '../firebase'
import{
    collection, doc, getDoc, addDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy, runTransaction, serverTimestamp, increment, setDoc
} from 'firebase/firestore'

import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'


export async function uploadLogo(file){
    const storageRef = ref(storage, `logo/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, file)
    return await getDownloadURL(storageRef)
}


export async function createBusiness(data){
    return await addDoc(collection(db, 'businesses'), {
        ...data,
        averageRating: 0,
        totalRatings: 0,
        ratingBreakdown: {1:0, 2:0, 3:0, 4:0, 5:0},
        createdAt: serverTimestamp()
    })
}

export async function getBusiness(businessId) {
    const snap = await getDoc(doc(db, 'businesses', businessId))
    return { ...snap.data(), id: snap.id }
}

export async function getAllBusinesses() {
    const snap = await getDocs(collection(db, 'businesses'))
    return snap.docs.map(d => ({ ...d.data(), id: d.id }))
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
    const newReviewRef = doc(collection(db, 'businesses', businessId, 'reviews'))

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

        transaction.set(newReviewRef,{
            userId,
            userEmail,
            rating,
            title,
            body, 
            createdAt: serverTimestamp()
        })
    })
}

export async function getReviews(businessId) {
    const q = query(
        collection(db, 'businesses', businessId, 'reviews'),
        orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ ...d.data(), id: d.id }))
}

export async function hasUserReviewed(businessId, userId){
    const q = query(
        collection(db, 'businesses', businessId, 'reviews'),
        where ('userId', '==', userId)
    )
    const snap = await getDocs(q)
    return !snap.empty //true if user alr left a review
}

//deals section
export async function addDeal(businessId, dealData, expiration){
    return await addDoc(collection(db, 'businesses', businessId, 'deals'), {
        ...dealData,
        isActive: true,
        expiryDate: expiration,
        createdAt: serverTimestamp()
    })
}

// export async function getActiveDeals(businessId){
//     const q = query(
//         collection(db, 'businesses', businessId, 'deal'),
//         where('isActive', '==', true),
//         where('expiryDate', '>', new Date())
//     )
//     const snap = await getDocs(q)
//     return snap.docs.map(d => ({id:d.id, ...d.data()}))
// }

// export async function getAllDeals(businessId){
//     const snap = await getDocs(collection(db, 'businesses', businessId, 'deals'))
//     return snap.docs.map(d => ({id: d.id, ...d.data()}))
// }

export async function getDeal(businessId){
    const snap = await getDoc(doc(db, 'businesses', businessId, 'deal'))
    if (!snap.exists()) return null
    return { id: snap.id, ...snap.data() }
}

export async function deactivateDeal(businessId, dealId){
    await updateDoc(doc(db, 'businesses', businessId, 'deals', dealId),{
        isActive: false
    })
}

export async function deleteDeal(businessId, dealId){
    await deleteDoc(doc(db, 'businesses', businessId, 'deals', dealId))
}

//bookmarks

export async function bookmarkBusiness(userId, businessId){
    const ref = doc(db, 'users', userId, 'bookmarks', businessId)
    await setDoc(ref, {
        businessId,
        savedAt: serverTimestamp()
    })
}

export async function removeBookmark(userId, businessId){
    await deleteDoc(doc(db, 'users', userId, 'bookmarks', businessId))
}

export async function isBookmarked(userId, businessId){
    const ref = doc(db, 'users', userId, 'bookmarks', businessId)
    const snap = await getDoc(ref)
    return snap.exists()
}

export async function getUserBookmarks(userId){
    const snap = await getDocs(collection(db, 'users', userId, 'bookmarks'))
    return snap.docs.map(d => d.data().businessId)
}


