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
        .background(Color.white)
        .cornerRadius(10)
        .shadow(radius: 5)
        .frame(maxWidth: .infinity)
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Color.gray, lineWidth: 1)
        )
        .frame(width: UIScreen.main.bounds.width * 0.8)
    }
}

struct CollectionsView: View {
    @State private var collections: [CollectionDTO] = []
    @State private var images: [URL] = []
    @State private var selectedCollection: CollectionDTO?
    
    var body: some View {
        ScrollView {
            VStack(spacing: 15) {
                Text("Collections")
                    .font(.title)
                    .bold()
                    .padding()
                
                ForEach(collections) { collection in
                    CollectionCardView(collection: collection)
                        .onTapGesture {
                            fetchImages(for: collection)
                        }
                }
            }
            .padding()
            .frame(maxWidth: .infinity)
        }
        .navigationTitle("Collections")
        .onAppear {
            fetchCollections()
        }
    }
    
    private func fetchCollections() {
        Auth.auth().currentUser?.getIDToken(completion: { idToken, error in
            guard error == nil else {
                print("Failed to get IDToken: \(String(describing: error))")
                return
            }
            
            guard let url = URL(string: "API_LINK") else {
                print("Failed to create URL for fetchCollections()")
                return
            }
            
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(idToken!)", forHTTPHeaderField: "Authorization")
            
            URLSession.shared.dataTask(with: request) { data, response, error in
                guard error == nil else {
                    print("Error in fetchCollections(): \(String(describing: error))")
                    return
                }
                
                guard let data = data else {
                    print("No data received in fetchCollections()")
                    return
                }
                
                let decoder = JSONDecoder()
                
                do {
                    let result = try decoder.decode(GiffyCollectionsResponse.self, from: data)
                    DispatchQueue.main.async {
                        self.collections = result.data
                        self.selectedCollection = self.collections.first
                        self.fetchImages(for: self.selectedCollection!)
                    }
                } catch {
                    // Attempt to decode as ErrorDTO
                    if let errorDTO = try? decoder.decode(ErrorDTO.self, from: data) {
                        print("Error in fetchCollections(): \(errorDTO.error)")
                    } else {
                        print("Error decoding data in fetchCollections(): \(error)")
                    }
                }
            }.resume()
        })
    }
    
    private func fetchImages(for collection: CollectionDTO) {
        selectedCollection = collection
        guard let url = URL(string: "API_LINK") else {
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                return
            }

            let decoder = JSONDecoder()
            do {
                let result = try decoder.decode(GiffyResponse.self, from: data)
                DispatchQueue.main.async {
                    self.images = result.data.map { URL(string: $0.firebaseUrl)! }
                }
            } catch {
                print(error)
            }
        }.resume()
    }
}

struct CollectionsView_Previews: PreviewProvider {
    static var previews: some View {
        CollectionsView()
    }
}
