import { PlusCircleIcon } from "@heroicons/react/24/outline";
import PageComponent from "../components/PageComponent";
import SurveyListItem from "../components/SurveyListItem";
import TButton from "../components/core/TButton";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect, useState } from "react";
import axiosClient from "../axios";
import PaginationLinks from "../components/PaginationLinks";
import { DotSpinner } from '@uiball/loaders'
import router from "../router";

export default function Surveys() {
  const { showToast } = useStateContext();
  const [surveys, setSurveys] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(false);

  const onDeleteClick = (id) => {
    if(window.confirm('Are you sure you want to delete this survey?')){
      axiosClient.delete(`/survey/${id}`)
        .then(() => {
          getSurveys();
          showToast('Survey successfully deleted!')
        });
    }
    
  };

  const onPageClick = (link) => {
    getSurveys(link.url)
  }

  const getSurveys = (url) => {
    url = url || '/survey'
    setLoading(true)
    axiosClient.get(url)
      .then(({data}) => {
        setSurveys(data.data)
        setMeta(data.meta)
        setLoading(false);
    });
  }

  useEffect(() => {
    getSurveys()
    
  }, []);

  return (
    <PageComponent title="Survey"
      buttons={(
        <TButton color="green" to="/surveys/create">
          <PlusCircleIcon className="h-6 w-6 mr-2" />
          <span className="pt-0.5">New Survey</span>
        </TButton>
      )}>
      {loading &&
        <div className="flex h-screen items-center justify-center">
          {/* <h3 className="text-white text-xl">Loading...</h3> */}
          

            <DotSpinner 
             size={70}
             speed={0.9} 
             color="white" 
            />
      </div>
      }
      
      {!loading &&
        <div >
          {surveys.length === 0 && <div className="py-8 text-center text-white">You don't have any surveys created!</div>}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {surveys.map(survey => (
                <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick} style={{animationDelay:'0.5s'}}/>
              ))}
          </div>
          {surveys.length > 0 &&
            <PaginationLinks meta={meta} onPageClick={onPageClick} />
          }
        </div>
      }
      
      

      </PageComponent>
    // <>
    //         <header className="bg-grbodydark border-b-2 border-grbtnred shadow">
    //             <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    //               <h1 className="text-3xl font-bold tracking-widest text-white">Surveys</h1>
    //             </div>
    //         </header>
    //         <main>
    //           <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
    //                   Survey Content  
    //           </div>
    //         </main>
    //     </>
  )
}

