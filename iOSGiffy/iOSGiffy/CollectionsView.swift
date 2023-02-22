//
//  CollectionsView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import SwiftUI
import FirebaseAuth

struct CollectionCardView: View {
    let collection: CollectionDTO
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(collection.collectionName)
                .font(.headline)
            Text("Collection ID: \(collection.collectionId)")
                .font(.subheadline)
            Text(collection.isPrivate ? "Private" : "Public")
                .font(.subheadline)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .frame(width: UIScreen.main.bounds.width * 0.8)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.gray, lineWidth: 1)
        )
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 5)
    }
}

struct CollectionsView: View {
    @State private var collections: [CollectionDTO] = []
    @State private var giffies: [GiffyDTO] = []
    @State private var selectedCollection: CollectionDTO?
    
    var body: some View {
        NavigationView {
            if let collection = selectedCollection {
                GiffiesView(giffies: giffies)
                    .navigationTitle(collection.collectionName)
                    .navigationBarTitleDisplayMode(.inline)
                    .navigationBarItems(leading: Button(action: {
                        selectedCollection = nil
                        giffies = []
                    }) {
                        Text("Back")
                    })
            } else {
                ScrollView {
                    VStack(spacing: 15) {
                        ForEach(collections) { collection in
                            CollectionCardView(collection: collection)
                                .onTapGesture {
                                    selectedCollection = collection
                                    getGiffiesByCollectionId(for: collection)
                                }
                        }
                    }
                    .padding()
                    .frame(maxWidth: .infinity)
                }
                .navigationTitle("Collections")
                .onAppear {
                    getCurrentUserCollections()
                }
            }
        }
    }
    
    private func getCurrentUserCollections() {
        NetworkManager.shared.getCurrentUserCollections { result in
            switch result {
            case .success(let collections):
                DispatchQueue.main.async {
                    self.collections = collections
                }
            case .failure(let error):
                print("Error fetching collections: \(error.localizedDescription)")
            }
        }
    }
    
    private func getGiffiesByCollectionId(for collection: CollectionDTO) {
        NetworkManager.shared.getGiffiesByCollectionId(for: collection) { result in
            switch result {
            case .success(let giffies):
                DispatchQueue.main.async {
                    self.giffies = giffies
                }
            case .failure(let error):
                print("Error fetching giffies: \(error.localizedDescription)")
            }
        }
    }
}

struct CollectionsView_Previews: PreviewProvider {
    static var previews: some View {
        CollectionsView()
    }
}
